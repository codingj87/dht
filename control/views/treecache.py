# -*- coding: utf-8 -*-
from collections import defaultdict

from django.utils.decorators import method_decorator
from django.core.cache import cache

from lib.view import View
# from ..models import Group
from ..deco import json_encode


class TreeView(View):
    @method_decorator(json_encode)
    def group(self, request):
        if request.METHOD == "POST":
            cache.clear()
            root = cache.get("group")
            if not root:
                self.update()
                root = cache.get("group")
            return [root]

    @classmethod
    def update(cls):
        cache.clear()
        groups = Group.objects.all().order_by("name")

        for group_type in ["group"]:
            group_map = defaultdict(list)
            for group in groups:
                group_map[group.pid].append(
                    {
                        "type": "group",
                        "id": "group-%d" % group.id,
                        "rid": group.id,
                        "name": group.name,
                        "text": group.name,
                    }
                )

            root = cls.recursive(group_type, group_map, group_map[0][0])
            root["expanded"] = True
            cache.set(type, root)

    @classmethod
    def recursive(cls, group_type, dictionary, node):
        group_id = node.get("rid")
        children = dictionary[group_id]

        for child in children:
            cls.recursive(group_type, dictionary, child)

        if children:
            node["children"] = children
            node["leaf"] = False
        else:
            node["iconCls"] = "x-fa fa-folder-o"
            node["children"] = None
            node["leaf"] = True
        return node


# EOF
