using ProEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CPiao.Common;
using Newtonsoft.Json;
using ProBusiness;
using ProBusiness.Manage;
using ProEntity.Manage;
using ProTools;

namespace CPiao.Controllers
{
    public class HomeController : BaseController
    {
        //
        // GET: /Home/

        public ActionResult Index()
        { 
            return View();
        }

        public ActionResult Register(string id)
        {
            if (CurrentUser != null)
            {
                return Redirect("/Home/Index");
            }
            HttpCookie cook = Request.Cookies["cp"];
            if (cook != null)
            {
                if (cook["status"] == "1")
                {
                    string operateip = OperateIP;
                    int result;
                    M_Users model = ProBusiness.M_UsersBusiness.GetM_UserByProUserName(cook["username"], cook["pwd"],
                        operateip, out result);
                    if (model != null)
                    {
                        model.LastLoginIP = OperateIP;
                        Session["Manager"] = model;
                        return Redirect("/Home/Index");
                    }
                }
            } 
            ViewBag.ID = string.IsNullOrEmpty(id) ? "" : id;
            return View(); 
        } 
        public ActionResult Register2()
        {
            return View();
        }
        public ActionResult Service()
        {
            return View();
        }

        public ActionResult Contact()
        {
            return View();
        }

        public ActionResult BaiduMap()
        {
            return View();
        }

        public ActionResult Login()
        {
            if (CurrentUser != null)
            {
                return Redirect("/Home/Index");
            }
            HttpCookie cook = Request.Cookies["cp"];
            if (cook != null)
            {
                if (cook["status"] == "1")
                {
                    string operateip = OperateIP;
                    int result;
                    M_Users model = ProBusiness.M_UsersBusiness.GetM_UserByProUserName(cook["username"], cook["pwd"], operateip, out result);
                    if (model != null)
                    {
                        model.LastLoginIP = OperateIP;
                        Session["Manager"] = model;
                        return Redirect("/Home/Index");
                    }
                }
            }
            return View();
        }
        public ActionResult Logout()
        { 
            HttpCookie cook = Request.Cookies["cp"];
            if (cook != null)
            {
                cook["status"] = "0";
                Response.Cookies.Add(cook);
            } 
            //Session["Manager"] = null;
            Session.RemoveAll();
            return Redirect("/Home/Login");
        }


        public ActionResult GoOnlinePay(int type, decimal money, string ordercode,int xl=1)
        {
            string paytype = "";
            if (type == 3)
            {
                paytype = "weixin_scan";
            }
            else if(type == 0)
            {
                paytype = "alipay_scan";
            }
            else if (type == 4)
            {
                paytype = "tenpay_scan";
            }
            Dictionary<string, string> dc =new Dictionary<string, string>();

            if (xl == 1)
            {
                dc = ZHFPayTools.onLinePay(OperateIP, "", "http://www.wancaiba000.com/Home/ZHFNotify", money, ordercode,
                    DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), paytype, "FENHONGDABUWAWA", 1, "", "");
                ViewBag.redo_flag = dc["redo_flag"];
                ViewBag.return_url = dc["return_url"];
                ViewBag.input_charset = dc["input_charset"];
                ViewBag.bank_code = "";
                ViewBag.pay_type = dc["pay_type"];
                ViewBag.msg ="";
                ViewBag.img = "";
                ViewBag.client_ip = dc["client_ip"];
                ViewBag.extend_param = dc["extend_param"];
                ViewBag.extra_return_param = dc["extra_return_param"];
                ViewBag.interface_version = dc["interface_version"];
                ViewBag.merchant_code = dc["merchant_code"];
                ViewBag.notify_url = dc["notify_url"];
                ViewBag.order_amount = dc["order_amount"];
                ViewBag.order_no = dc["order_no"];
                ViewBag.order_time = dc["order_time"];
                ViewBag.product_name = dc["product_name"];
                ViewBag.product_num = dc["product_num"];
                ViewBag.service_type = dc["service_type"];
                ViewBag.sign = dc["sign"];
                ViewBag.sign_type = dc["sign_type"];
                ViewBag.qrcodeurl = "";
            }
            else
            {
                dc = ZHFPayTools.onLinePay2(OperateIP, "", "http://www.wancaiba000.com/Home/ZHFNotify", money, ordercode,
                  DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), paytype, "FENHONGDABUWAWA", 1, "", "");
                ViewBag.redo_flag = "";
                ViewBag.return_url = "";
                ViewBag.input_charset = "";
                ViewBag.bank_code = "";
                ViewBag.pay_type = "";
                ViewBag.msg = dc["msg"];
                ViewBag.img = dc["img"];
                ViewBag.client_ip ="";
                ViewBag.extend_param = "";
                ViewBag.extra_return_param ="";
                ViewBag.interface_version = "";
                ViewBag.merchant_code ="";
                ViewBag.notify_url ="";
                ViewBag.order_amount = dc["order_amount"];
                ViewBag.order_no ="";
                ViewBag.order_time = "";
                ViewBag.product_name ="";
                ViewBag.product_num ="";
                ViewBag.service_type = "";
                ViewBag.sign ="";
                ViewBag.sign_type ="";
                ViewBag.qrcodeurl = dc["qrcodeurl"];
                LogHelper.Info("UpdateStatus", "TaskBase", "qrcode111:" + ViewBag.qrcodeurl);
            }
            ViewBag.type = type == 0 ? "支付宝" : type == 3 ? "微信" : type == 4 ? "QQ扫码" : "网银";
            ViewBag.xl = xl;

            ViewBag.url = xl== 2 ? "https://api.zhihpay.com/gateway/api/scanpay" : "https://pay.zhihpay.com/gateway?input_charset=UTF-8";
            return View(); 
        }
        /// <summary>
        /// 用户登录
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="pwd"></param>
        /// <returns></returns>
        public JsonResult UserLogin(string userName, string pwd,string remember="")
        {
            bool bl = false; 
            string operateip =OperateIP;
            int result = 0;
            string msg = "";
            ProEntity.Manage.M_Users model = ProBusiness.M_UsersBusiness.GetM_UserByProUserName(userName, pwd, operateip, out result);
            if (model != null)
            { 
                if (model.Status <2 )
                { 
                    model.LastLoginIP = OperateIP;
                    HttpCookie cook = new HttpCookie("cp");
                    cook["username"] = userName;
                    cook["pwd"] = pwd;
                    if (remember == "1")
                    {
                        cook["status"] = remember;
                    }
                    cook.Expires = DateTime.Now.AddDays(7);
                    Response.Cookies.Add(cook);
                    CurrentUser = model;
                    Session["Manager"] = model;
                    result = 1;
                }
                else 
                {
                    msg = result == 3 ? "用户已被禁闭，请联系管理员" : "用户名或密码错误！";
                }
            }
            else
            {
                msg = result == 3 ? "用户已被禁闭，请联系管理员" : result == 2?"用户名不存在":"用户名或密码错误！";
            }
            JsonDictionary.Add("result", result);
            JsonDictionary.Add("Errmsg", msg);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult UserRegister(string userName, string pwd, string id) 
        {

            string Errmsg = "";
            M_Users user=new M_Users()
            {
                Type = 0,
                SourceType = 0,
                UserName = userName,
                LoginName = userName,
                LoginPwd = pwd,
                Description="自动注册",
                RoleID="48eb0491-d92c-4664-ab27-37320ac7de38"
                //dd87ca0a-b425-4e1e-b7ec-7a1e02dad0f8 代理角色
                //48eb0491-d92c-4664-ab27-37320ac7de38 会员ID
            };
            var result = M_UsersBusiness.CreateM_User(user, ref Errmsg);
            if (string.IsNullOrEmpty(Errmsg))
            {
                return UserLogin(userName, pwd);
            }
            else
            {
                JsonDictionary.Add("result", result);
                JsonDictionary.Add("Errmsg", Errmsg);
                return new JsonResult
                {
                    Data = JsonDictionary,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            }

        }

        public JsonResult UserNameCheck(string userName)
        {
            JsonDictionary.Add("result", ProBusiness.M_UsersBusiness.GetM_UserCountByLoginName(userName)==0);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }


        public void ZHFNotify()
        {
            string merchant_code = Request.Params.AllKeys.Contains("merchant_code") ? Request["merchant_code"].ToString().Trim() : ZHFPayTools.partner;
            string notify_type = Request.Params.AllKeys.Contains("notify_type") ? Request["notify_type"].ToString().Trim() : "offline_notify";
            string notify_id = Request.Params.AllKeys.Contains("notify_id") ? Request["notify_id"] ?? "".ToString().Trim() : "";
            string interface_version = Request.Params.AllKeys.Contains("interface_version") ? Request["interface_version"].ToString().Trim() : "V3.0";
            string sign_type = Request.Params.AllKeys.Contains("sign_type") ? Request["sign_type"].ToString().Trim() : "RSA-S";
            string zhfsign = Request.Params.AllKeys.Contains("sign") ? Request["sign"].ToString().Trim() : "";
            string order_no = Request.Params.AllKeys.Contains("order_no") ? Request["order_no"].ToString().Trim() : "";
            string order_time = Request.Params.AllKeys.Contains("order_time") ? Request["order_time"].ToString().Trim() : "";
            string order_amount = Request.Params.AllKeys.Contains("order_amount") ? Request["order_amount"].ToString().Trim() : "";
            string extra_return_param = Request.Params.AllKeys.Contains("extra_return_param") ? Request["extra_return_param"] : "";
            string trade_no = Request.Params.AllKeys.Contains("trade_no") ? Request["trade_no"].ToString().Trim() : "";
            string orginal_money = Request.Params.AllKeys.Contains("orginal_money") ? Request["orginal_money"] : "";
            string trade_time = Request.Params.AllKeys.Contains("trade_time") ? Request["trade_time"].ToString().Trim() : "";
            string trade_status = Request.Params.AllKeys.Contains("trade_status") ? Request["trade_status"].ToString().Trim() : "";
            string bank_seq_no = Request.Params.AllKeys.Contains("bank_seq_no") ? Request["bank_seq_no"] : "";

            /**
             *签名顺序按照参数名a到z的顺序排序，若遇到相同首字母，则看第二个字母，以此类推，
            *参数名1=参数值1&参数名2=参数值2&……&参数名n=参数值n
            **/
            //组织订单信息
            string signStr = "";

            if (null != bank_seq_no && bank_seq_no != "")
            {
                signStr = signStr + "bank_seq_no=" + bank_seq_no.ToString().Trim() + "&";
            }

            if (null != extra_return_param && extra_return_param != "")
            {
                signStr = signStr + "extra_return_param=" + extra_return_param + "&";
            }
            signStr = signStr + "interface_version=" + interface_version + "&";
            signStr = signStr + "merchant_code=" + merchant_code + "&";


            if (null != notify_id && notify_id != "")
            {
                signStr = signStr + "notify_id=" + notify_id + "&notify_type=" + notify_type + "&";
            }

            signStr = signStr + "order_amount=" + order_amount + "&";
            signStr = signStr + "order_no=" + order_no + "&";
            signStr = signStr + "order_time=" + order_time + "&";
            if (null != orginal_money && orginal_money != "")
            {
                signStr = signStr + "orginal_money=" + orginal_money + "&";
            }
            signStr = signStr + "trade_no=" + trade_no + "&";
            signStr = signStr + "trade_status=" + trade_status;

            if (null != trade_time && trade_time != "")
            {
                signStr = signStr + "&trade_time=" + trade_time;
            }

            /**
            1)zhf_public_key，智汇付公钥，每个商家对应一个固定的智汇付公钥（不是使用工具生成的密钥merchant_public_key，不要混淆），
            即为智汇付商家后台"公钥管理"->"智汇付公钥"里的绿色字符串内容
            2)demo提供的zhf_public_key是测试商户号1111110166的智汇付公钥，请自行复制对应商户号的智汇付公钥进行调整和替换。
            */

            string zhf_public_key = ZHFPayTools.zhfpubkey;
            //将智汇付公钥转换成C#专用格式
            zhf_public_key = ZHFPayTools.RSAPublicKeyJava2DotNet(zhf_public_key);
            //验签
            bool result = ZHFPayTools.ValidateRsaSign(signStr, zhf_public_key, zhfsign);
            if (result == true)
            {
                //判断该笔订单是否在商户网站中已经做过处理
                //如果没有做过处理，根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细，并执行商户的业务程序
                //请务必判断请求时的total_fee、seller_id与通知时获取的total_fee、seller_id为一致的
                //如果有做过处理，不执行商户的业务程序
                //获取订单详情
                UserOrders order = UserOrdersBusiness.GetUserOrderDetail(order_no);
                if (order != null && !string.IsNullOrEmpty(order.OrderCode))
                {
                    decimal total_fee = decimal.Parse(order_amount);
                    if (string.IsNullOrEmpty(orginal_money))
                    {
                        total_fee = decimal.Parse(orginal_money);
                    }
                    if (order.PayFee == total_fee)
                    {
                        //订单支付及后台客户授权
                        bool flag = UserOrdersBusiness.OrderAuditting(order.OrderCode, trade_no, total_fee);
                        if (flag)
                        {
                            //如果验签结果为true，则对订单进行更新
                            //订单更新完之后必须打印SUCCESS来响应智汇付服务器以示商户已经正常收到智汇付服务器发送的异步数据通知，否则智汇付服务器将会在之后的时间内若干次发送同一笔订单的异步数据！！
                            Response.Write("success"); //请不要修改或删除
                        }
                    }
                }
            }
            else
            {
                //验签失败
                Response.Write("验签失败");
            }

        }
    }
}
