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
    pageIndex: 1
};


$(function () {
    $('#search').click(function () {
        Params.pageIndex = 1;
        records.getParams();
        records.getRecords();
    });
    $('#lotteryslt').change(function () {
        var _this = $(this);
        if (_this.val() == "") {
            $('#lotteryplays').html('<option value="">所有玩法</option>');
            $('#issueslt').html('<option value="">所有奖期</option>');
        } else {
            $.post('/Lottery/GetNavsList', { cpcode: _this.val() }, function (data) {
                var html = '<option value="">所有玩法</option>';
                for (var i = 0; i < data.items.length; i++) {
                    html += '<option value="' + data.items[i].PCode + '">' + data.items[i].PName + '</option>';
                }
                $('#lotteryplays').html(html);
            });
            $.post('/Lottery/GetlotteryResult', { cpcode: _this.val(), status: -1, pagesize: 78 }, function (data) {
                var html = '<option value="">所有奖期</option>';
                for (var i = 0; i < data.items.length; i++) {
                    html += '<option value="' + data.items[i].IssueNum + '">' + data.items[i].IssueNum + '</option>';
                }
                $('#issueslt').html(html);
            });
        }
    });
    $('.button1').each(function (i, v) {
        $(v).click(function () {
            Params.playtype = $(v).data('playtype');
            Params.selfrange =0;
            Params.state = $('.state').val();  
            Params.winType = $('#winType').val();
            Params.cpcode = $('#lotteryslt').val();
            Params.issuenum = $('#issueslt').val();
            Params.lcode = $('#lcode').val();
            Params.btime = $('#btime').val();
            Params.etime = $('#etime').val();
            Params.type = $('#lotteryplays').val();
            Params.pageIndex = 1;
            records.getRecords();
        });
    });
});

records.getParams = function () { 
    Params.state = $('.state').val();
    Params.playtype = $('#playtype').val();
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
    $.post('/Report/GetLotteryOrderReportList', Params,
    function (data) {
        var html = '';
        if (data.items != null && data.items.length > 0) {
            for (var i = 0; i < data.items.length; i++) {
                var item = data.items[i];
                html += '<tr><td>' + item.AutoID + '</td><td>' + item.UserName + '</td><td>2016-12-03 12:00:00</td><td>' + item.PlayTypeName + '</td><td>' + item.CPName + '</td><td>' + item.TypeName + '</td><td>' + item.IssueNum + '</td><td>元</td><td>' + item.WinFee + '</td><td>' + item.PayFee + '</td><td>' + item.Account + '</td><td>' + item.Remark + '</td></tr>';
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
                records.getRecords();
            }
        });
    });
}