/**
 * Created by Administrator on 2016/10/5.
 */
function getCode(n)
{
    var s="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    var checknum="";
    for(var i=0;i<n;i++)
    {
        var index=Math.floor(Math.random()*62);
        checknum+=s.charAt(index);
    }
    return checknum;

}
function show(obj)
{
    document.getElementById(obj).value = getCode(4);
    $('#' + obj).val(getCode(4));
}
 

