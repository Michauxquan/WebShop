using ProEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
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
        

        
    }
}
