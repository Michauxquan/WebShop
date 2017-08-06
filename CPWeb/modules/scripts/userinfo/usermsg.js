var reg = /^[1-9]*[1-9][0-9]*$/; 
var receivers = "";
var tempModel;
$(function() {
    $('#receivelist option').dblclick(function () {
        if ($(this).val() == "" || $(this).val() == null) { 
            return false;
        } 
        if (receivers.indexOf($(this).val()) == -1) {
            receivers += $(this).val() + ",";
            var html = '<div id="id_' + $(this).val() + '" data-id="' + $(this).val() + '" class="receiver" onclick="removed(\'' + $(this).val() + '\');">' + $(this).text() + '<span class="delete-icon" title="点击移除"></span></div>';
            $('#receivediv').append(html);
        } else {
            alert('收件人已存在,不能重复添加!');
        }
    });
    $('#send-message').click(function() {
        var receivers = '';
        $('.receiver').each(function(i, v) {
            receivers += $(v).data('id') + ",";
        });
        if (receivers != "") {
            if ($('#receive_name').val() != '') {
                repModel.FromReplyID = '';
                repModel.FromReplyUserID = '';
                repModel.GuID = receivers;
                repModel.Content = $('#write-content').val();
                repModel.Title = $('#receive_name').val();
                SavaReply();
            } else {
                alert('标题为空,发送失败');
            }
        } else {
            alert('收件人未选择,发送失败');
            return false;
        }
    });
    $('#save').click(function () {
        var receivers = tempModel.CreateUserID;
        if (receivers != "") { 
            repModel.FromReplyID = tempModel.ReplyID;
            repModel.FromReplyUserID = tempModel.GuID;
            repModel.GuID = receivers;
            console.log(new Date());
            repModel.Content = encodeURI("<font  color='#FF3300'>" + new Date().format("yyyy-MM-dd hh:mm:ss") + "写：</font>" + $('#recontent').val() + "<br>");
            repModel.Title = 'Re:' + tempModel.Title;
            SavaReply(); 
        } else {
            alert('收件人未选择,发送失败');
            return false;
        }
    });
    $('.btn1').click(function () {
        var _this = $(this);
        UpdStatus(_this,1);
    });
    $('.btn2').click(function () {
        var _this = $(this);
        UpdStatus(_this, 9);
    });
    $('#back').click(function () {
        $('#replaydetail').hide();
        $('.pws_tabs_scale_show').show();
    });
    $(".checkAll").click(function () {
        var _this = $(this); 
        if (_this.attr('checked') == 'checked') {
            _this.removeAttr('checked');
            _this.parents('.sx').find('.check').click();
        } else {
            _this.attr('checked', 'checked');
            _this.parents('.sx').find('.check').click(); 
        }
    });
   
}); 
var  Params= {type:0,pageIndex:1}

function removed(id) { 
    $('#id_' + id).remove();
    receivers=receivers.replace(id + ',', '');
}

function GetReplay() {
    $.post('/User/GetMsgList', Params,
    function (data) {
        var html = '';
        if (data.items!=null && data.items.length > 0) {
            for (var i = 0; i < data.items.length; i++) {
                html += '<tr><td style="width: 40px; text-align: left;"><input type="checkbox" class="check" style="margin-left: 12px;" data-id="' + data.items[i].ReplyID + '" name="check"/> </td>' +
                    '<td  data-id="' + data.items[i].ReplyID + '" class="adetail">' + data.items[i].Title + '</td><td>' + data.items[i].FromName + '</td><td>' + convertdate(data.items[i].CreateTime, true) + '</td></tr>';
            }
        } else {
            html += '<tr><td colspan="4" style="text-align: center;">暂无数据</td></tr> ';
        }
        $('#sxmsg' + Params.type).html(html);
        $("#sxmsg" + Params.type+" .check").click(function () {
            var _this = $(this);
            if (_this.attr('checked') == 'checked') {
                _this.removeAttr('checked');
                _this.parents('.sx').find('.checkAll').removeAttr('checked');
            } else {
                _this.attr('checked', 'checked'); 
                if ($("#sxmsg" + Params.type + " .check:checked").length == $("#sxmsg" + Params.type + " .check").length) {
                    _this.parents('.sx').find('.checkAll').attr('checked', 'checked');
                }
            }
        });

        if (Params.type == 0) {
            $("#sxmsg" + Params.type + " .adetail").click(function() {
                var id = $(this).data('id');
                $.post('/User/ReplyDetail', { id: id }, function(data) {
                    if (data.Item != null) {
                        var item = data.Item;
                        tempModel = item;
                        $('.scribe-title').html(item.Title);
                        $('#sendusername').html(item.UserName);
                        $('#sendtime').html(convertdate(item.CreateTime, true));
                        $('#recontent').val(''); 
                        var content = decodeURI(item.Content).repeat('<font/g', '||').split('||');
                        var html1 = '';
                        for (var j = 0; j < content.length; j++) {
                            if (content[j] != '') {
                                html1 += '<div style="margin-top: 10px; color: #666666; width: 80%; border-top: 1px #666666 dotted;">' + content[j] + '</div>';
                            }
                        }
                        if (html1 == "") {
                            html1 = decodeURI(item.Content);
                        }
                        $('.message-content').html(html1);
                        $('.pws_tabs_scale_show').hide();
                        $('#replaydetail').show();
                    }
                });
            });
        } 
        $('.pws_tabs_list').css("height", (106 + $('#sxmsg' + Params.type + " tr").length * 41)+'px');
        $("#pager" + Params.type).paginate({
            total_count: data.totalCount,
            count: data.pageCount,
            start: Params.pageIndex,
            display: 5,
            border: true,
            rotate: true,
            images: false,
            mouse: 'slide',
            onChange: function(page) {
                Params.pageIndex = page;
                GetReplay();
            }
        });
    });
}

var repModel = { 
    GuID: '',
    Content: '',
    Title: '',
    FromReplyID: '',
    FromReplyUserID: '',
    Type:0
}

function SavaReply() {
    if (repModel.Title == '' || repModel.GuID=='') {
        return false;
    } 
    $.post('/User/SaveReply', { entity: JSON.stringify(repModel) },
    function (data) {
        if (data.result) {
            $('.receive_content').val('');
            $('#receive_name').val('');
            $('#receivediv').html('');
            alert('提交成功');
            receivers = '';
            if ($('#replaydetail').css('display') == 'block') {
                $('#back').click();
            }
        } else {
            alert(data.ErrMsg); 
        } 
    });
};
function UpdStatus(obj, status) {
    var list = $('#' + obj.parent().data('type') + ' .check:checked');
    if (list.length > 0) {
        var ids = '';
        list.each(function (i, v) { ids = $(v).data('id') + ','; });
        $.post('/User/UpdStatus', { ids: ids, status: status }, function(data) {
            if (data.result) { 
                GetReplay();
            } else {
                alert(data.ErrMsg);
            }
        });
    } else {
        alert('未选择操作项，操作失败!');
    }
}
 
 
