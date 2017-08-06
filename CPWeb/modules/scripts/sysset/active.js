define(function (require, exports, module) {
    var Global = require("global"),
        doT = require("dot"),
         Upload = require("upload"), ImgsIco,
        Verify = require("verify"), VerifyObject, editor, 
        moment = require("moment");
    require("daterangepicker");
    require("pager");
    var Model = {}, Param = { keywords: "", pageIndex: 1, pageSize: 15, btime: "", etime: "" ,type:-1}
    var ObjectJS = {};
    //初始化
    ObjectJS.init = function (Editor) {
        var _self = this;
        editor = Editor;
        _self.bindEvent();
        _self.getList();
    }
    //绑定事件
    ObjectJS.bindEvent = function () {
        var _self = this;

        $(document).click(function (e) {
            //隐藏下拉
            if (!$(e.target).parents().hasClass("dropdown-ul") && !$(e.target).parents().hasClass("dropdown") && !$(e.target).hasClass("dropdown")) {
                $(".dropdown-ul").hide();
            }
        });

        $("#createModel").click(function () { 
            $(window.parent.document).find("#mainframe").attr('src', '/SysSet/ActiveAdd/');
        });
        //删除
        $("#deleteObject").click(function () {
            var id = $(this).data("id");
            confirm("活动删除后不可恢复,确认删除吗？", function() {
                _self.deleteModel(id, function(status) {
                    if (status == 1) {
                        _self.getList();
                    } else {
                        alert('删除失败，请联系管理员');
                    }
                });
            });
        });
        //编辑
        $("#updateObject").click(function () {
            var _this = $(this);
            $(window.parent.document).find("#mainframe").attr('src', '/SysSet/ActiveDetail/' + _this.data("id")); 
        });
        require.async("search", function () {
            $(".searth-module").searchKeys(function (keyWords) {
                Param.pageIndex = 1;
                Param.keywords = keyWords;
                _self.getList();
            });
        });

        $("#btnSaveActive").on("click", function () {
            if (!VerifyObject.isPass()) {
                return;
            }
            _self.activeId = -1; 
            _self.SaveActive();
        });

        VerifyObject = Verify.createVerify({
            element: ".verify",
            emptyAttr: "data-empty",
            verifyType: "data-type",
            regText: "data-text"
        }); 
        ImgsIco = Upload.createUpload({
            element: '#actimg',
            buttonText: "选择活信息海报",
            className: "btn",
            data: { folder: '', action: 'add', oldPath: '' },
            success: function (data, status) {
                if (data.Items.length > 0) {
                    $('#imgurl').val(data.Items[0]);
                    $('#productImg').attr("src", data.Items[0]);
                } else {
                    alert("只能上传jpg/png/gif类型的图片，且大小不能超过1M！");
                }
            }
        });
        $("#iptCreateTime").daterangepicker({
            showDropdowns: true,
            empty: true,
            opens: "right",
            ranges: {
                '今天': [moment(), moment()],
                '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                '上周': [moment().subtract(6, 'days'), moment()],
                '本月': [moment().startOf('month'), moment().endOf('month')]
            }
        }, function (start, end, label) {
            Param.btime = start ? start.format("YYYY-MM-DD") : "";
            Param.etime = end ? end.format("YYYY-MM-DD") : "";
            Param.pageIndex = 1;
            _self.getList();
        }); 
        var Types = [{ID: "0",Name: "活动"},{ID: "1",Name: "公告"}];
        require.async("dropdown", function () {
            $("#activeType").dropdown({
                prevText: "信息类型-",
                defaultText: "全部",
                defaultValue: "-1",
                data: Types,
                dataValue: "ID",
                dataText: "Name",
                width: "120",
                onChange: function (data) {
                    Param.pageIndex = 1;
                    Param.type = data.value;
                    _self.getList();
                }
            }); 
        });
        //下拉状态、类型查询
        require.async("dropdown", function () { 
            $("#acttype").dropdown({
                prevText: "",
                defaultText: "请选择",
                defaultValue: "",
                data: Types,
                dataValue: "ID",
                dataText: "Name",
                width: "120",
                onChange: function (data) {
                  
                }
            }); 
        });
    } 
    //获取列表
    ObjectJS.getList = function () {
        var _self = this;
        $(".tr-header").nextAll().remove();
        $(".tr-header").after("<tr><td colspan='8'><div class='data-loading'><div></td></tr>");
        Global.post("/SysSet/GetActiveList", Param, function (data) {
            _self.bindList(data.items);
            $("#pager").paginate({
                total_count: data.TotalCount,
                count: data.PageCount,
                start: Param.pageIndex,
                display: 5,
                border: true,
                rotate: true,
                images: false,
                mouse: 'slide',
                onChange: function (page) {
                    Param.pageIndex = page;
                    _self.getList();
                }
            });
        });
    }
 
    ObjectJS.bindList = function (items) {
        var _self = this;
        $(".tr-header").nextAll().remove();
        if (items.length > 0) {
            doT.exec("template/SysSet/active.html", function (template) {
                var innerhtml = template(items);
                innerhtml = $(innerhtml);
                //操作
                innerhtml.find(".dropdown").click(function () {
                    var _this = $(this);
                    if (_this.data("type") != 1) {
                        var position = _this.find(".ico-dropdown").position();
                        $(".dropdown-ul li").data("id", _this.data("id"));
                        $(".dropdown-ul").css({ "top": position.top + 20, "left": position.left - 55 }).show().mouseleave(function () {
                            $(this).hide();
                        });
                    }
                });

                $(".tr-header").after(innerhtml);
            });
        }
        else {
            $(".tr-header").after("<tr><td colspan='8'><div class='noDataTxt' >暂无数据!</div></td></tr>");
        }
    } 
    //删除
    ObjectJS.deleteModel = function (id, callback) {
        Global.post("/SysSet/DeleteActive", { roleid: id }, function (data) {
            !!callback && callback(data.status);
        });
    }

    //绑定权限页样式
    ObjectJS.initAdd = function (actid, Editor, model) {
        var _self = this; 
        editor = Editor; 
        try {
            model = JSON.parse(model.replace(/&quot;/g, '"'));
            _self.bindDetail(model);
        } catch (err) {
            Global.post("/SysSet/GetActiveByID", { id: actid }, function (data) {
                var _model = data.Item;
                _self.bindDetail(_model);
                model = _model;
            });
        }
        _self.bindActiveAdd(model); 
    }
    ObjectJS.saveParams = {
        AutoID: -1,
        Type:"",
        BTime: "",
        ETime: "",
        Tips:"",
        Content: "",
        Img:"",
        Title:""
    }
    ObjectJS.bindActiveAdd = function (model) {
        var _self = this; 

        _self.activeId = model != null ? model.AutoID : -1;
        //日期插件
        $("#iptCreateTime1").daterangepicker({
            showDropdowns: true,
            empty: true,
            opens: "right",
            ranges: {
                '今天': [moment(), moment()],
                '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                '上周': [moment().subtract(6, 'days'), moment()],
                '本月': [moment().startOf('month'), moment().endOf('month')]
            }
        }, function (start, end, label) { 
            _self.saveParams.BTime = start ? start.format("YYYY-MM-DD") : "";
            _self.saveParams.ETime = end ? end.format("YYYY-MM-DD") : "";
        }); 
        ImgsIco= Upload.createUpload({
            element: '#actimg1',
            buttonText: "选择信息海报",
            className: "btn",
            data: { folder: '', action: 'add', oldPath: '' },
            success: function (data, status) {
                if (data.Items.length > 0) {
                    $('#productImg').attr("src", data.Items[0]);
                    $('#imgurl').val(data.Items[0]);
                } else {
                    alert("只能上传jpg/png/gif类型的图片，且大小不能超过1M！");
                }
            }
        });
       
        _self.saveParams.BTime = model != null ?convertdate(model.BTime, true):"";
        _self.saveParams.ETime = model != null ?convertdate(model.ETime, true):""; 
        $("#iptCreateTime1").val(_self.saveParams.BTime + ' 至 ' + _self.saveParams.ETime);
        $("#btnSaveActive").on("click", function () {
            if (!VerifyObject.isPass()) {
                return;
            }
            _self.SaveActive();
        });

        VerifyObject = Verify.createVerify({
            element: ".verify",
            emptyAttr: "data-empty",
            verifyType: "data-type",
            regText: "data-text"
        });
        var Types = [{ ID: "0", Name: "活动" }, { ID: "1", Name: "公告" }];
        //下拉状态、类型查询 
        _self.saveParams.Type = model != null ?model.Type:"";
        require.async("dropdown", function () { 
            $("#acttype1").dropdown({
                prevText: "信息类型-",
                defaultText: model != null ? (model.Type == 1 ? "公告" : "活动") : "全部",
                defaultValue: model != null ? model.Type:"",
                data: model != null ? [] : Types,
                dataValue: "ID",
                dataText: "Name",
                width: "120",
                onChange: function (data) { 
                    _self.saveParams.Type = data.value;
                    if (data.value == 0) {
                        _self.saveParams.BTime = Date.now().toString().toDate("yyyy-MM-dd");
                        _self.saveParams.ETime = Date.now().toString().toDate("yyyy-MM-dd");
                        $('#iptCreateTime1').val(_self.saveParams.BTime + "至" + _self.saveParams.ETime);
                    } else {
                        _self.saveParams.BTime = '';
                        _self.saveParams.ETime = '';
                        $('#iptCreateTime1').val('');
                    }
                }
            }); 
        });
    }
    ObjectJS.SaveActive = function () {
        var _self = this; 
        if ($('#acttitle').val() == "") {
            alert("信息标题不能为空");
            return false;
        }
        if (_self.saveParams.Type==="" ) {
            alert("信息类型未选择.");
            return false;
        }
        if (_self.saveParams.Type === 0 && $('#imgurl').val()==="" ) {
            alert("信息图片未选择.");
            return false;
        }
        if (ObjectJS.saveParams.BTime == "" || ObjectJS.saveParams.ETime=="") {
            alert("信息有效期不能为空");
            return false;
        }
        _self.saveParams.AutoID = _self.activeId;
        _self.saveParams.Tips = $('#acttips').val();
        _self.saveParams.Content = encodeURI(editor.getContent());
        _self.saveParams.Img = $('#productImg').attr('src');
        _self.saveParams.Title = $('#acttitle').val();
        Global.post("/SysSet/SaveActive", { entity:JSON.stringify(_self.saveParams) }, function (data) {
            if (data.result) {
                window.history.go(-1);
            } else {
                alert('操作失败');
            }
        });
    }

    ObjectJS.bindDetail = function(model) {
        var _self = this; 
        _self.AutoID =model != null? model.AutoID:-1;
        $("#acttitle").val(model != null?model.Title:"");
        $("#acttips").val(model != null?model.Tips:"");
        $("#imgurl").val(model != null?model.Img:"");
        $("#productImg").attr("src", model != null?model.Img:"");
        editor.ready(function() {
            editor.setContent(decodeURI(model != null?model.Content:""));
        }); 
    }
    module.exports = ObjectJS;
});