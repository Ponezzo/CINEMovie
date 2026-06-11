from django.urls import path
from . import views

urlpatterns = [
    path('movies/', views.movie_list),
    path('movies/<int:movie_pk>/', views.movie_detail),
    path('movies/<int:movie_pk>/recommendations/', views.movie_recommendations),
    path('movies/<int:movie_pk>/reviews/', views.movie_reviews),
    
    # 커뮤니티 관련 URL
    path('posts/', views.post_list),
    path('posts/<int:post_pk>/', views.post_detail),
    path('posts/<int:post_pk>/comments/', views.comment_create),
]
