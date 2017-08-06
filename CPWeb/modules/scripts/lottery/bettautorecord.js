var records = {};
var Params = {
    cpcode: '',
    status: -1,
    btime: '',
    etime: '',
    type: '',
    issuenum: '',
    lcode: '',
    winType: -1,
    selfrange: -1,
    pageIndex:1
};


$(function () {
    $('#search').click(function() {
        records.getRecords();
    });
    $('#lotteryslt').change(function() {
        var _this = $(this);
        if (_this.val() == "") {
            $('#lotteryplays').html('<option value="">所有玩法</option>');
            $('#issueslt').html('<option value="">所有奖期</option>');
        } else {
            $.post('/Lottery/GetNavsList', { cpcode: _this.val() }, function(data) {
                var html = '<option value="">所有玩法</option>';
                for (var i = 0; i < data.items.length; i++) {
                    html += '<option value="' + data.items[i].PCode + '">' + data.items[i].PName + '</option>';
                }
                $('#lotteryplays').html(html);
            });
            $.post('/Lottery/GetlotteryResult', { cpcode: _this.val(), status:-1,pagesize: 78 }, function (data) {
                var html = '<option value="">所有奖期</option>';
                for (var i = 0; i < data.items.length; i++) {
                    html += '<option value="' + data.items[i].IssueNum + '">' + data.items[i].IssueNum + '</option>';
                }
                $('#issueslt').html(html);
            });
        }
    });

});

records.getParams= function() {
    Params.status = $('#status').val();
    Params.selfrange = $('#selfrange').val();
    Params.winType = $('#winType').val();
    Params.cpcode = $('#lotteryslt').val();
    Params.issuenum = $('#issueslt').val();
    Params.lcode = $('#lcode').val();
    Params.btime = $('#btime').val();
    Params.etime = $('#etime').val();
    Params.type = $('#lotteryplays').val();
}
records.getRecords = function () {
    records.getParams();
    $.post('/Lottery/GetBettAutoRecord', Params,
    function (data) {
        var html = '';
        if (data.items != null && data.items.length > 0) {
            for (var i = 0; i < data.items.length; i++) {
                var item = data.items[i];
                html += '<tr><td>' + item.BCode + '</td><td>' + item.UserName + '</td><td>'+convertdateTostring(item.CreateTime,true,'yyyy-MM-dd hh:mm:ss')+'</td><td>'+item.CPName+'</td><td>'+item.TypeName+'</td>' +
                    '<td>' + item.IssueNum + '</td><td>' + item.BettNum + '</td><td>' + item.ComNum + '</td><td>' + item.Content + '</td><td>元</td><td>'+item.TotalFee+'</td><td>' + item.ComFee + '</td>' +
                    '<td>' + (item.Status == 0 ? "未开奖" : (item.Status == 1 ? "已中奖" : (item.Status == 2 ? "未中奖" : (item.Status == 3 ? "已撤单" : "已删除")))) + '</td></tr>';
            }
        } else {
            html += '<tr><td height="37" colspan="13" style="text-align: center;" class="needq"><span>暂无记录</span></td></tr>';
        }
        $('.data-table tbody').html(html);   
        $("#pager").paginate({
            total_count: data.totalCount,
            count: data.pageCount,
            start: Params.pageIndex,
            display: 5,
            border: true,
            rotate: true,
            images: false,
            mouse: 'slide',
            onChange: function (page) {
                Params.pageIndex = page;
                GetReplay();
            }
        });
    });
}