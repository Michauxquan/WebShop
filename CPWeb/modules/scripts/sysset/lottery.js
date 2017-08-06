define(function (require, exports, module) {
    var Global = require("global"),
        doT = require("dot"),
        Verify = require("verify"), VerifyObject,
        Easydialog = require("easydialog");
    require("switch");
    var Model = {},
        cacheMenu = [];

    var ObjectJS = {};
    //初始化
    ObjectJS.init = function () {
        var _self = this;
        _self.bindEvent();
        _self.getList();
    }
    //绑定事件
    ObjectJS.bindEvent = function () {
        var _self = this; 

        $("#createModel").click(function () {
            var _this = $(this);
            Model.AutoID = -1;
            Model.CPCode = '';
            Model.CPName = '';
            Model.IconType = '';
            Model.OpenTimes = 12;
            Model.OnSaleTime = '';
            Model.CloseTime = '';
            Model.SealTimes = 10;
            Model.PeriodsNum = 1;
            //Model.Sort = 0;
            Model.ResultUrl ='';
            _self.createModel();
        });  
    }
    //添加/编辑弹出层
    ObjectJS.createModel = function () {
        var _self = this;

        doT.exec("template/SysSet/lottery-detail.html", function (template) {
            var html = template([]);
            Easydialog.open({
                container: {
                    id: "show-model-detail",
                    header: Model.AutoID<1 ? "新建彩种" : "编辑彩种",
                    content: html,
                    yesFn: function () {
                        if (!VerifyObject.isPass()) {
                            return false;
                        }
                        Model.AutoID = $("#modelAutoID").val();
                        Model.CPCode = $("#modelCPCode").val();
                        Model.CPName = $("#modelCPName").val();
                        Model.IconType = $("#modelIconType").val();
                        Model.ResultUrl = $("#modelResultUrl").val();
                        Model.OpenTimes = $("#modelOpenTimes").val();
                        Model.OnSaleTime = $("#modelOnSaleTime").val();
                        Model.CloseTime = $("#modelCloseTime").val();
                        Model.SealTimes = $("#modelSealTimes").val();
                        Model.PeriodsNum = $("#modelPeriodsNum").val();
                        _self.saveModel(Model);
                    },
                    callback: function () {

                    }
                }
            });
            VerifyObject = Verify.createVerify({
                element: ".verify",
                emptyAttr: "data-empty",
                verifyType: "data-type",
                regText: "data-text"
            });
            if (Model.AutoID == -1) {
                $("#modelCPCode").focus();
                $("#modelCPCode").removeAttr('readonly');
                $("#modelCPName").removeAttr('readonly');
            } else {
                $("#modelCPCode").attr('readonly', 'readonly');
                $("#modelCPName").attr('readonly', 'readonly');
                $("#modelResultUrl").focus();
            } 
            $("#modelCPCode").val(Model.CPCode);
            $("#modelAutoID").val(Model.AutoID);
            $("#modelCPName").val(Model.CPName);
            $('#modelResultUrl').val(Model.ResultUrl);
            $("#modelIconType").val(Model.IconType);
            $("#modelOpenTimes").val(Model.OpenTimes);
            $("#modelOnSaleTime").val(Model.OnSaleTime);
            $("#modelCloseTime").val(Model.CloseTime);
            $("#modelSealTimes").val(Model.SealTimes);
            $("#modelPeriodsNum").val(Model.PeriodsNum);

        });
    }
    //获取列表
    ObjectJS.getList = function () {
        var _self = this;
        $(".tr-header").nextAll().remove();
        $(".tr-header").after("<tr><td colspan='10'><div class='data-loading'><div></td></tr>");
        Global.post("/SysSet/GetLotterys", {}, function (data) {
            _self.bindList(data.items);
        });
    }
    //加载列表
    ObjectJS.bindList = function (items) {
        var _self = this;
        $(".tr-header").nextAll().remove();

        if (items.length > 0) {
            doT.exec("template/SysSet/lottery.html", function (template) {
                var innerhtml = template(items);
                innerhtml = $(innerhtml); 
                innerhtml.find(".setpermission").each(function () {
                    if ($(this).data("type") == 1) {
                        $(this).remove();
                    }
                });

                //绑定启用插件
                innerhtml.find(".status").switch({
                    open_title: "点击销售",
                    close_title: "点击停售",
                    value_key: "value",
                    change: function (data, callback) { 
                        confirm("暂停销售后用户表不可购买此彩种,确认暂停销售吗？", function () {
                            _self.deleteModel(data.data("id"), data.data("value") ? 0 : 1, function (status) { 
                                if (status) {
                                    _self.getList();
                                } else {
                                    alert("执行失败请联系管理员");
                                }
                            });
                        });
                    }
                });
                //操作
                innerhtml.find(".editObject").click(function () {
                    var _this = $(this);
                    Global.post("/SysSet/GetLotteryByID", { autoid: _this.data("id") }, function (data) {
                        var model = data.model;
                        Model.AutoID = model.AutoID;
                        Model.CPCode = model.CPCode;
                        Model.CPName = model.CPName;
                        Model.IconType = model.IconType; 
                        Model.OpenTimes = model.OpenTimes;
                        Model.OnSaleTime = model.OnSaleTime;
                        Model.CloseTime = model.CloseTime;
                        Model.SealTimes = model.SealTimes;
                        Model.PeriodsNum = model.PeriodsNum;
                        Model.ResultUrl = model.ResultUrl;
                        _self.createModel();
                    });
                });
                $(".tr-header").after(innerhtml);
            });
        }
        else {
            $(".tr-header").after("<tr><td colspan='10'><div class='noDataTxt' >暂无数据!</div></td></tr>");
        }
    }
    //保存实体
    ObjectJS.saveModel = function (model) {
        var _self = this;
        Global.post("/SysSet/SaveLottery", { entity: JSON.stringify(model) }, function(data) {
            if (data.model.AutoID > 0) {
                _self.getList();
            }
        });
    }
    //删除
    ObjectJS.deleteModel = function (id,status, callback) {
        Global.post("/SysSet/DeleteLottery", { autoid: id, status: status ,}, function (data) {
            !!callback && callback(data.status);
        });
    }

    //绑定权限页样式
    //绑定权限页样式
    ObjectJS.initPermission = function (lotterid, permissions, menus,cmenus,tmenus) {
        var _self = this;
        permissions = JSON.parse(permissions.replace(/&quot;/g, '"'));
        cmenus = JSON.parse(cmenus.replace(/&quot;/g, '"'));
        tmenus = JSON.parse(tmenus.replace(/&quot;/g, '"'));
        for (var i = 0; i < cmenus.length; i++) {
            cmenus[i].ChildPlays = tmenus;
        }
        for (var i = 0; i < permissions.length; i++) {
            permissions[i].ChildPlays = cmenus;
        }
       
        menus = JSON.parse(menus.replace(/&quot;/g, '"')); 
        _self.bindMenu(permissions, menus);
        
        _self.bindPermissionEvent(lotterid);


    }

    ObjectJS.bindPermissionEvent = function (lotterid) { 
        $("#savePermission").click(function () {
            var menus = "";
            $("#rolePermission input").each(function () {
                if ($(this).prop("checked")) { 
                    var pcontent = $(this).parent().parent().find('.pcontent');
                    if (pcontent.length > 0 && pcontent.val().length>0) {
                        menus += $(this).data("id") + "|" + pcontent.val() + ",";
                    } else {
                        menus += $(this).data("id") + "|,";
                    }
                }
            }); 
            Global.post("/SysSet/SaveLotteryPlays", {
                lotterid: lotterid,
                permissions: menus
            }, function (data) {
                if (data.status) {
                    alert("彩票玩法设置成功！");
                } else {
                    alert("彩票玩法设置失败！");
                }
            });
        });
    }

    ObjectJS.bindMenu = function (permissions, menus) {
        
        var _self = this;
        for (var i = 0, j = permissions.length; i < j; i++) {
            var menu = permissions[i];
            cacheMenu[menu.PCode] = menu.ChildPlays;
        } 
        doT.exec("template/sysset/plays.html", function (template) {

            var innerHtml = template(permissions);
            innerHtml = $(innerHtml);

            $("#rolePermission").append(innerHtml);

            innerHtml.find("input").change(function () {
                var _this = $(this);
                if (_this.prop("checked")) {
                    _this.parent().addClass("checked").removeClass("check");
                    $("#" + _this.data("id")).find("input").prop("checked", _this.prop("checked"));
                    $("#" + _this.data("id")).find("label").addClass("checked").removeClass("check");
                } else {
                    _this.parent().addClass("check").removeClass("checked");
                    $("#" + _this.data("id")).find("input").prop("checked", _this.prop("checked"));
                    $("#" + _this.data("id")).find("label").addClass("check").removeClass("checked");
                }
            }); 
            //默认选中拥有权限 
            innerHtml.find("input").each(function () {
                var _this = $(this);
                for (var i = 0, j = menus.length; i < j; i++) { 
                    if (_this.data("id") == menus[i].PIDS) {
                        _this.prop("checked", true);
                        _this.parent().addClass("checked").removeClass("check");
                        var pcontent = _this.parent().parent().find('.pcontent');
                        if (pcontent.length > 0) {
                            pcontent.val(menus[i].Content);
                        }
                    }
                }
            });

            innerHtml.find(".openchild").each(function () {
                var _this = $(this);
                var _obj = _self.getChild(_this.attr("data-id"), _this.prevUntil("div").html(), _this.attr("data-eq"), menus);
                _this.parent().after(_obj);
                _this.on("click", function () {
                    if (_this.attr("data-state") == "close") {
                        _this.attr("data-state", "open");
                        _this.removeClass("icoopen").addClass("icoclose");

                        $("#" + _this.attr("data-id")).show();

                    } else { //隐藏子下属
                        _this.attr("data-state", "close");
                        _this.removeClass("icoclose").addClass("icoopen");

                        $("#" + _this.attr("data-id")).hide();
                    }
                });
            });
        });
    }

    //展开下级
    ObjectJS.getChild = function (menuCode, provHtml, isLast, menus) { 
        var _self = this;
        var teplist = menuCode.split('_');
        var keys = teplist.length > 1 ? teplist[teplist.length - 1] : menuCode;
        var _div = $(document.createElement("div")).attr("id", menuCode).addClass("hide").addClass("childbox");
        for (var i = 0; i < cacheMenu[keys].length; i++) {
            var _item = $(document.createElement("div")).addClass("menuitem");

            //添加左侧背景图
            var _leftBg = $(document.createElement("div")).css("display", "inline-block").addClass("left");
            _leftBg.append(provHtml);
            if (isLast == "last") {
                _leftBg.append("<span class='null left'></span>");
            } else {
                _leftBg.append("<span class='line left'></span>");
            }
            _item.append(_leftBg);

            //是否最后一位
            if (i == cacheMenu[keys].length - 1) {
                _item.append("<span class='lastline left'></span>"); 
                //加载显示下属图标和缓存数据
                if (cacheMenu[keys][i].ChildPlays && cacheMenu[keys][i].ChildPlays.length > 0) {
                    _item.append("<span data-id='" + menuCode + "_" + cacheMenu[keys][i].PCode + "'  data-eq='last' data-state='close' class='icoopen openchild left'></span>");
                    if (!cacheMenu[cacheMenu[keys][i].PCode]) {
                        cacheMenu[cacheMenu[keys][i].PCode] = cacheMenu[keys][i].ChildPlays;
                    }
                }
            } else {
                _item.append("<span class='leftline left'></span>"); 
                //加载显示下属图标和缓存数据
                if (cacheMenu[keys][i].ChildPlays && cacheMenu[keys][i].ChildPlays.length > 0) {
                    _item.append("<span data-id='" + menuCode + "_" + cacheMenu[keys][i].PCode + "' data-eq='' data-state='close' class='icoopen openchild left'></span>");
                    if (!cacheMenu[cacheMenu[keys][i].PCode]) {
                        cacheMenu[cacheMenu[keys][i].PCode] = cacheMenu[keys][i].ChildPlays;
                    }
                }
            }

            _item.append("<label class='check left'><input type='checkbox' class='left'  value='" + cacheMenu[keys][i].PCode + "' data-id='" + menuCode + "_" + cacheMenu[keys][i].PCode + "' /><span>" + cacheMenu[keys][i].PName + "</span></label><input type='text' style=' width:40%; border:0px;opacity: 1;' class='pcontent' value='' />");

            _div.append(_item);

            _item.find("input").change(function () {
                var _this = $(this); 
                if (_this.prop("checked")) {
                    _this.parent().addClass("checked").removeClass("check");
                    $("#" + _this.data("id")).find("input").prop("checked", _this.prop("checked"));
                    $("#" + _this.data("id")).find("label").addClass("checked").removeClass("check");
                    _this.parents().each(function () {
                        var _parent = $(this);
                        if (_parent.hasClass("childbox")) {
                            _parent.prev().find("input").prop("checked", true);
                            _parent.prev().find("label").addClass("checked").removeClass("check");
                        }
                    });
                } else {
                    _this.parent().addClass("check").removeClass("checked");
                    $("#" + _this.data("id")).find("input").prop("checked", _this.prop("checked"));
                    $("#" + _this.data("id")).find("label").addClass("check").removeClass("checked");
                }
            });
            //默认加载下级
            _item.find(".openchild").each(function () {
                var _this = $(this); 
                var _obj = _self.getChild(_this.attr("data-id"), _leftBg.html(), _this.attr("data-eq"), menus);
                _this.parent().after(_obj);
                
                _this.on("click", function () {
                    if (_this.attr("data-state") == "close") {
                        _this.attr("data-state", "open");
                        _this.removeClass("icoopen").addClass("icoclose");

                        $("#" + _this.attr("data-id")).show();

                    } else { //隐藏子下属
                        _this.attr("data-state", "close");
                        _this.removeClass("icoclose").addClass("icoopen");

                        $("#" + _this.attr("data-id")).hide();
                    }
                });
            });
        }

        //默认选中拥有权限
        _div.find("input").each(function () {
            var _this = $(this);
            for (var i = 0, j = menus.length; i < j; i++) {
                if (_this.data("id") == menus[i].PIDS) {
                    _this.prop("checked", true);
                    _this.parent().addClass("checked").removeClass("check");
                    var pcontent = _this.parent().parent().find('.pcontent');
                    if (pcontent.length > 0) {
                        pcontent.val(menus[i].Content);
                    } 
                }

            }
        });
        return _div;
    }

    module.exports = ObjectJS;
});