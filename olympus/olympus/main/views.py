from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.views import login as auth_login
from django.contrib.auth.decorators import login_required

# Create your views here.
def index(request):

	if request.user.is_active:
		return redirect('info_url')

	return render(request, "index.html")

def login(request):
    #return auth_login(request)
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                auth_login(request)
                return redirect('info_url')


    # invalid login
    return redirect('index_url')

@login_required
def info(request):
	return render(request,"info.html")