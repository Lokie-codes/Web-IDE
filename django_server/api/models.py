from django.db import models
import nanoid

def generate_id():
    return nanoid.generate(size=10)

class Gist(models.Model):
    id = models.CharField(max_length=10, primary_key=True, default=generate_id)
    title = models.CharField(max_length=255, default='Untitled')
    language = models.CharField(max_length=50)
    code = models.TextField()
    theme = models.CharField(max_length=50, default='vs-dark')
    view_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'gists'

class Project(models.Model):
    id = models.CharField(max_length=10, primary_key=True, default=generate_id)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'projects'

class ProjectFile(models.Model):
    id = models.CharField(max_length=10, primary_key=True, default=generate_id)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='files')
    path = models.CharField(max_length=500)
    content = models.TextField(null=True, blank=True)
    is_folder = models.BooleanField(default=False)
    parent_path = models.CharField(max_length=500, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'project_files'
        unique_together = ('project', 'path')
        indexes = [
            models.Index(fields=['project', 'parent_path']),
        ]
