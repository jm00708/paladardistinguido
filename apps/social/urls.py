from django.urls import path
from .views import (
    AllPaladarTypesView,
    FollowView,
    GeneralFeedView,
    MyWallView,
    PaladarTypeView,
    PostCommentView,
    PostReactionView,
    SuggestedDinersView,
)

urlpatterns = [
    path('feed/',                          GeneralFeedView.as_view()),
    path('wall/',                          MyWallView.as_view()),
    path('posts/<int:post_id>/react/',     PostReactionView.as_view()),
    path('posts/<int:post_id>/comment/',   PostCommentView.as_view()),
    path('follow/<int:diner_id>/',         FollowView.as_view()),
    path('paladar-type/',                  PaladarTypeView.as_view()),
    path('paladar-types/',                 AllPaladarTypesView.as_view()),
    path('suggestions/',                   SuggestedDinersView.as_view()),
]
