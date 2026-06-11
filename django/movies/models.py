from django.db import models
from django.conf import settings

class Movie(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Recommendation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    recommended_at = models.DateTimeField(auto_now_add=True)
    recommendation_method = models.CharField(max_length=50, default='user')

    def __str__(self):
        return f"Recommendation for {self.user.username} - {self.movie.title}"

class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # 1-5 rating scale
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Review of {self.movie.title} by {self.user.username}"


class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    movie_title = models.CharField(max_length=100, blank=True, null=True)
    movie_poster = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.title

    # ManyToManyField 사용 시 'comments'의 related_name을 변경
    comments = models.ManyToManyField('Comment', related_name='related_posts', blank=True)


class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    # post 필드의 related_name을 'comment_posts'로 설정하여 충돌 방지
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comment_posts')

    def __str__(self):
        return f"Comment by {self.user.username} on post {self.post.title}"


