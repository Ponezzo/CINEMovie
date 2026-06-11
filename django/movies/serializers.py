from rest_framework import serializers
from .models import Movie, Recommendation, Review, Post, Comment

class MovieListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ('id', 'title', 'content')

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'
        read_only_fields = ('user',)

class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendation
        fields = ('id', 'user', 'movie', 'recommended_at', 'recommendation_method')

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('id', 'user', 'movie', 'rating', 'content', 'created_at', 'updated_at')

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Comment
        fields = ('id', 'user', 'content', 'created_at')

class PostSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    comments = CommentSerializer(many=True, read_only=True)  # 댓글을 실제 시리얼라이저로 처리

    class Meta:
        model = Post
        fields = ('id', 'user', 'title', 'content', 'movie_title', 'movie_poster', 'created_at', 'updated_at', 'comments')  # 'comments' 필드를 'fields'에 추가


