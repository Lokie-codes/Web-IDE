from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Prefetch
import zipfile
import io
from django.http import HttpResponse

from .models import Gist, Project, ProjectFile
from .serializers import GistSerializer, ProjectSerializer, ProjectFileSerializer
from .services.piston import piston_service
import nanoid

class HealthCheckView(APIView):
    def get(self, request):
        return Response({
            "status": "ok",
            "uptime": 0 # Placeholder
        })

class ExecuteView(APIView):
    def post(self, request):
        language = request.data.get('language')
        code = request.data.get('code')
        stdin = request.data.get('stdin', '')
        args = request.data.get('args', [])

        if not language or not code:
            return Response({
                "success": False,
                "error": "Language and code are required"
            }, status=status.HTTP_400_BAD_REQUEST)

        version = piston_service.get_language_version(language)
        result = piston_service.execute_code(language, version, code, stdin, args)
        return Response(result)

class RuntimesView(APIView):
    def get(self, request):
        try:
            runtimes = piston_service.get_runtimes()
            return Response({
                "success": True,
                "runtimes": runtimes
            })
        except Exception as e:
            return Response({
                "success": False,
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AICompleteView(APIView):
    def post(self, request):
        prompt = request.data.get('prompt')
        code = request.data.get('code')
        language = request.data.get('language')

        response = {
            "success": True,
            "suggestion": f"// AI-generated suggestion for {language}\n// This is a placeholder response\n{code}\n\n// Add your implementation here",
            "confidence": 0.85
        }
        return Response(response)

class AIExplainView(APIView):
    def post(self, request):
        code = request.data.get('code')
        language = request.data.get('language')

        explanation = {
            "success": True,
            "explanation": f"This {language} code performs the following operations:\n\n1. Defines variables and functions\n2. Implements core logic\n3. Returns results\n\nWould you like a more detailed explanation?",
            "complexity": "O(n)",
            "suggestions": [
                "Consider adding error handling",
                "Add input validation",
                "Optimize loops"
            ]
        }
        return Response(explanation)

class GistViewSet(viewsets.ModelViewSet):
    queryset = Gist.objects.all().order_by('-created_at')
    serializer_class = GistSerializer
    lookup_field = 'id'

    def create(self, request, *args, **kwargs):
        # Override create to match Node.js response structure if needed
        # Node returns { success: true, gist: { ... } }
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({
            "success": True,
            "gist": serializer.data
        }, status=status.HTTP_200_OK, headers=headers)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        instance.view_count += 1
        instance.save()
        serializer = self.get_serializer(instance)
        return Response({
            "success": True,
            "gist": serializer.data
        })

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            "success": True,
            "message": "Gist updated successfully"
        })

    def list(self, request, *args, **kwargs):
        limit = int(request.query_params.get('limit', 10))
        queryset = self.get_queryset()[:limit]
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "success": True,
            "gists": serializer.data
        })

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by('-updated_at')
    serializer_class = ProjectSerializer
    lookup_field = 'id'

    def create(self, request, *args, **kwargs):
        name = request.data.get('name')
        if not name:
             return Response({
                "success": False,
                "error": "Project name is required"
            }, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        project = serializer.save()

        # Create default files
        default_files = [
            {'path': 'src', 'is_folder': True, 'content': None, 'parent_path': None},
            {'path': 'src/index.js', 'is_folder': False, 'content': '// Start coding here\nconsole.log("Hello, World!");', 'parent_path': 'src'},
            {'path': 'README.md', 'is_folder': False, 'content': f'# {name}\n\n{request.data.get("description", "A new project")}', 'parent_path': None},
        ]

        for file_data in default_files:
            ProjectFile.objects.create(project=project, **file_data)

        # Re-fetch to include files in response (though standard create might not need to return files immediately, Node does: { success: true, project: { id, name, description } })
        # Node impl returns just project metadata initially?
        # Node: res.json({ success: true, project: { id, name, description } });
        
        return Response({
            "success": True,
            "project": {
                "id": project.id,
                "name": project.name,
                "description": project.description
            }
        })

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Node: returns project + files
        # We need to manually construct this or use serializer
        # Serializer includes files.
        # But we need to order files by is_folder desc, path asc
        
        files = instance.files.all().order_by('-is_folder', 'path')
        project_data = ProjectSerializer(instance).data
        project_data['files'] = ProjectFileSerializer(files, many=True).data

        return Response({
            "success": True,
            "project": project_data
        })

    def list(self, request, *args, **kwargs):
        limit = int(request.query_params.get('limit', 20))
        queryset = self.get_queryset()[:limit]
        # List projects (no files needed usually for list, but Node returns id, name, description, created_at, updated_at). 
        # Serializer has files. We might want a basic serializer.
        # But for now, using the same is fine, just maybe heavy if many files. 
        # Actually Node SQL query `SELECT id, name, description, created_at, updated_at FROM projects ...` does NOT join files.
        # So we should exclude files.
        
        projects = []
        for p in queryset:
            projects.append({
                "id": p.id,
                "name": p.name,
                "description": p.description,
                "created_at": p.created_at,
                "updated_at": p.updated_at
            })

        return Response({
            "success": True,
            "projects": projects
        })

    @action(detail=True, methods=['get'])
    def download(self, request, id=None):
        project = self.get_object()
        files = project.files.filter(is_folder=False).order_by('path')

        buffer = io.BytesIO()
        with zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED) as archive:
            for file in files:
                archive.writestr(file.path, file.content or '')
        
        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename="{project.name}.zip"'
        return response

class ProjectFileView(APIView):
    def post(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)
        path = request.data.get('path')
        if not path:
             return Response({
                "success": False,
                "error": "File path is required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            file = ProjectFile.objects.create(
                project=project,
                path=path,
                content=request.data.get('content', ''),
                is_folder=request.data.get('isFolder', request.data.get('is_folder', False)),
                parent_path=request.data.get('parentPath', request.data.get('parent_path', None))
            )
            # Update project timestamp
            project.save() # Updates updated_at

            return Response({
                "success": True,
                "file": ProjectFileSerializer(file).data
            })
        except Exception as e:
             if "unique constraint" in str(e).lower():
                 return Response({
                    "success": False,
                    "error": "File or folder already exists at this path"
                 }, status=status.HTTP_400_BAD_REQUEST)
             return Response({
                "success": False,
                "error": str(e)
             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProjectFileDetailView(APIView):
    def put(self, request, project_id, file_id):
        file = get_object_or_404(ProjectFile, id=file_id, project_id=project_id)
        file.content = request.data.get('content', file.content)
        file.path = request.data.get('path', file.path)
        file.save()
        
        # Update project timestamp
        file.project.save()

        return Response({
            "success": True,
            "message": "File updated successfully"
        })

    def delete(self, request, project_id, file_id):
        file = get_object_or_404(ProjectFile, id=file_id, project_id=project_id)
        
        if file.is_folder:
            # Delete children
            # Django might not do this recursively if using filter delete on paths?
            # Model logic: we store parent_path. 
            # We need to delete where path starts with file.path + '/' or parent_path starts with...
            # The Node logic `path LIKE ? OR parent_path LIKE ?`
            
            # Note: SQLite LIKE is case insensitive by default depending on PRAGMA, but usually fine.
            # Django: startswith
            ProjectFile.objects.filter(project_id=project_id, path__startswith=f"{file.path}/").delete()
            ProjectFile.objects.filter(project_id=project_id, parent_path__startswith=f"{file.path}").delete()
            # Wait, parent_path matching file.path exactly too.
        
        file.delete()
        
        return Response({
            "success": True,
            "message": "File deleted successfully"
        })
