# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.utils.decorators import method_decorator

from ..deco import login_required
from ..view import View


class DHCPView(View):
    @method_decorator(login_required)
    def index(self, request):
        return render(request, "dht.html")

    @method_decorator(login_required)
    def devel(self, request):
        return render(request, "development.html")


# END
