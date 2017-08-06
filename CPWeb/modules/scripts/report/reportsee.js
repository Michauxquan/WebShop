var records = {};
var Params = {
    btime: '',
    etime: '', 
    pageIndex: 1
};


$(function () {
    $('.search').click(function () {
        records.getParams();
        if (Params.btime == '') {
            alert('请选择开始时间!');
        } else {
            records.getRecords();
        }
    }); 
});

records.getParams = function () { 
    Params.btime = $('#btime').val();
    Params.etime = $('#etime').val(); 
}
records.getRecords = function () {
    
    $.post('/Report/GetUserReport', Params,
    function (data) {
        var html = '';
        if (data.items != null && data.items.length > 0) {
            for (var i = 0; i < data.items.length; i++) {
                var item = data.items[i];
                html += '<tr><td>' + item.UserName + '</td> <td>' + item.UserPoint + '</td><td>' + item.TotalPayMent + '</td> <td>' + item .TotalReturn+ '</td><td>' + item.TotalWin + '</td> <td>' + (item.TotalWin - item.TotalPayMent) + '</td></tr>';               
            }
        } else {
            html += '<tr><td height="37" colspan="6" style="text-align: center;" class="needq"><span>暂无记录</span></td></tr>';
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