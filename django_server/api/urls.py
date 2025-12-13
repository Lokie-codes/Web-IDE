from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HealthCheckView, ExecuteView, RuntimesView, AICompleteView, AIExplainView,
    GistViewSet, ProjectViewSet, ProjectFileView, ProjectFileDetailView
)

router = DefaultRouter(trailing_slash=False) # Node often doesn't enforce trailing slash, but consistency is good. Let's see. Node routes: /api/gists, /api/gists/:id.
# trailing_slash=False usually matches Node/Express style better.
router.register(r'gists', GistViewSet)
router.register(r'projects', ProjectViewSet)

# Custom routes for ProjectFileView because it's nested in meaning, though flattened in implementation above for viewsets.
# Node: POST /api/projects/:id/files -> ProjectFileView
#       PUT /api/projects/:projectId/files/:fileId
#       DELETE 
#       GET /api/projects/:id/download

urlpatterns = [
    path('health', HealthCheckView.as_view(), name='health'),
    path('execute', ExecuteView.as_view(), name='execute'),
    path('execute/runtimes', RuntimesView.as_view(), name='runtimes'),
    path('ai/complete', AICompleteView.as_view(), name='ai_complete'),
    path('ai/explain', AIExplainView.as_view(), name='ai_explain'),
    
    # Project File management (nested routes manually defined)
    path('projects/<str:project_id>/files', ProjectFileView.as_view(), name='project_files_create'),
    path('projects/<str:project_id>/files/<str:file_id>', ProjectFileDetailView.as_view(), name='project_file_detail'),
    
    # Include Router URLs
    path('', include(router.urls)),
]
