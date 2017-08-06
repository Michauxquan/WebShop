define(function (require, exports, module) {
    var Global = require("global"),
        doT = require("dot"),
        Verify = require("verify"), VerifyObject,
        Easydialog = require("easydialog"); 
    var Model = {}, Paras = { pageIndex: 1}

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
            Model.AutoID =-1;
            Model.CardCode = "";
            Model.BankName = "";
            Model.TrueName = "";
            Model.Type = 0;
            Model.BankChild = "";
            Model.BankPre = "";
            Model.BankCity = "";
            _self.createModel();
        });     
        $("#lockCards").click(function () {
            confirm("用户解绑后不可恢复,确认解绑吗？", function () {
                Global.post("/Account/LockBanks", null, function (data) {
                    if (data.result == 1) {
                        _self.getList();
                    } else {
                        alert("操作失败,请重新操作！");
                    }
                });
            });
        });
    }
    //添加/编辑弹出层
    ObjectJS.createModel = function () {
        var _self = this;
        doT.exec("template/SysSet/bank-detail.html", function (template) {
            var html = template([]);
            Easydialog.open({
                container: {
                    id: "show-model-detail",
                    header: !Model.AutoID ? "添加银行卡" : "编辑银行卡",
                    content: html,
                    yesFn: function () { 
                        if (!VerifyObject.isPass() || !_self.checkform()) {
                            return false;
                        } 
                        Model.TrueName = $("#modelTrueName").val();
                        Model.CardCode = $('#modelCardCode').val();
                        Model.BankName = $("#modelBankName").find("option:selected").text();;
                        Model.Type = $("#modelBankName").val();
                        Model.BankChild = $("#modelBankChild").val();
                        Model.BankPre = $("#modelBankPre").val();
                        Model.BankCity = $("#modelBankCity").val();
                        Model.AutoID = $("#modelAutoID").val();
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
            new PCAS("modelBankPre", "modelBankCity");
        });
    }

    //获取列表
    ObjectJS.getList = function () {
        var _self = this;
        $(".tr-header").nextAll().remove();
        $(".tr-header").after("<tr><td colspan='4'><div class='data-loading'><div></td></tr>");
        Global.post("/Account/BankList", Paras, function (data) {
            _self.bindList(data.Items);
        });
    }

    //加载列表
    ObjectJS.bindList = function (items) {
        var _self = this;
        $(".tr-header").nextAll().remove();
        if (items.length > 0) {
            doT.exec("template/SysSet/banks.html", function (template) {
                var innerhtml = template(items);
                innerhtml = $(innerhtml);
                //操作
                innerhtml.find(".delete").click(function () {
                    var _this = $(this);
                    var id = _this.data("id");
                    confirm("用户解绑后不可恢复,确认解绑吗？", function () {
                        Global.post("/Account/DeleteBanks", { id: id }, function (data) {
                            if (data.result == 1) {
                                _self.getList();
                            } else {
                                alert("操作失败,请重新操作！");
                            }
                        });
                    }); 
                });
                $(".tr-header").after(innerhtml);
            });
        }
        else {
            $(".tr-header").after("<tr><td colspan='4'><div class='noDataTxt' >暂无数据!</div></td></tr>");
        }
    } 
    //保存实体
    ObjectJS.saveModel = function (model) {
        var _self = this; 
        Global.post("/Account/SaveBanks", { entity: JSON.stringify(model) }, function(data) {
            if (data.result) {
                _self.getList();
            } else {
                alert(data.ErrMsg);
            }
        }); 
    }
     
    ObjectJS.checkform = function () { 
        var repSpecial = /[\<\>\~\!\@\#\$\%\^\&\*\-\+\=\|\\\'\"\?\,\/\[\]\{}\(\)]{1,}/;

        var bank = $("#modelBankName");
        if (bank.val() == "") {
            alert('请选择 "开户银行"');
            bank.focus();
            return false;
        }
        var bankid = parseInt(bank.value, 10);
        var province = $('#modelBankPre');
        if (province.val() == "") {
            alert('请选择 "开户银行卡省份"');
            province.focus();
            return false;
        }
        var city = $("#modelBankCity");
        if (city.val() == "") {
            alert('请选择 "开户银行卡城市"');
            city.focus();
            return false;
        }

        var re = /^(.){1,20}$/;
        if (!re.test($('#modelBankChild').val()) || repSpecial.test($('#modelBankChild').val())) {
            alert('"支行名称" 不符合规则, 请重新输入');
            $('#modelBankChild').focus();
            return false;
        }

        var re = /^(.){1,10}$/;
        if (!re.test($('#modelTrueName').val()) || repSpecial.test($('#modelTrueName').val()) || $('#modelTrueName').val() == "") {
            alert('"开户人姓名" 不符合规则, 请重新输入');
            $('#modelTrueName').focus();
            return false;
        }

        var re = /^\d{16}$|^\d{18}$|^\d{19}$/;
        var cardno = $('#modelCardCode');
        if (!re.test(cardno.val())) {
            alert('"银行账号" 不符合规则, 请重新输入');
            cardno.focus();
            return false;
        }
        var cardno_again = $('#modelCardCodeConfirmPwd');
        if (cardno.val() != cardno_again.val()) {
            alert('两次填写的 "银行账号" 不相同, 请仔细核对后再次提交');
            cardno_again.focus();
            return false;
        }
        return true;
    }
    module.exports = ObjectJS;
});