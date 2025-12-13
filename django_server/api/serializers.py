from rest_framework import serializers
from .models import Gist, Project, ProjectFile

class GistSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = Gist
        fields = ['id', 'title', 'language', 'code', 'theme', 'url', 'created_at', 'updated_at', 'view_count']
        read_only_fields = ['id', 'created_at', 'updated_at', 'view_count']

    def get_url(self, obj):
        return f"/gist/{obj.id}"

class ProjectFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectFile
        fields = ['id', 'project', 'path', 'content', 'is_folder', 'parent_path', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'project']

class ProjectSerializer(serializers.ModelSerializer):
    files = ProjectFileSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'created_at', 'updated_at', 'files']
        read_only_fields = ['id', 'created_at', 'updated_at']
