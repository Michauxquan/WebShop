using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using ProBusiness;
using ProBusiness.Common;
using ProBusiness.UserAttrs;
using ProEntity;
using ProEntity.Manage;

namespace CPiao.Controllers
{
    [CPiao.Common.UserAuthorize]
    public class AccountController : BaseController
    {
        //
        // GET: /Account/

        public ActionResult AccountSafe()
        {
            var model = M_UsersBusiness.GetUserDetail(CurrentUser.UserID);
            var logmd = LogBusiness.GetLogsByUserID(CurrentUser.UserID, 2);
            ViewBag.UserName = model.UserName;
            ViewBag.LastIP = model.LastLoginIP == "::1" ? "127.0.0.1" : model.LastLoginIP;
            ViewBag.LastTime = logmd.CreateTime.ToString("yyyy-MM-dd HH:mm:ss"); 
            ViewBag.HasEmail = !string.IsNullOrEmpty(model.Email);
            ViewBag.HasMobile = !string.IsNullOrEmpty(model.MobilePhone);
            ViewBag.HasAccount = !string.IsNullOrEmpty(model.AccountPwd);
            var temp = CurrentUser; 
            Session["Manage"] = model;
            return View();
        }

        public ActionResult MyCard()
        {
            return View();
        }
        public ActionResult Banks()
        { 
            if (getAccountSession("MyCard")){
                ViewBag.Max = 5;
                ViewBag.Hour = 6;
                ViewBag.HasCount = UserBanksBusiness.GetCount(CurrentUser.UserID);
                return View();
            }else
            {
                return Redirect("MyCard");
            }
        }
            

        #region Ajax

        public JsonResult UpdPwd(int type, string oldpwd, string newpwd)
        {
            var result = false;
            var model = CurrentUser;
            string msg = "";
            if (type == 0 && Encrypt.GetEncryptPwd(oldpwd, CurrentUser.LoginName).ToLower() != CurrentUser.LoginPwd.ToLower())
            {
                msg = "旧密码错误,操作失败";
            }
            else if (type == 1 && !string.IsNullOrEmpty(CurrentUser.AccountPwd) &&
                      CurrentUser.AccountPwd.ToLower() != Encrypt.GetEncryptPwd(newpwd, CurrentUser.LoginName).ToLower())
            {
                msg = "资金密码错误,操作失败";
            }
            else if (type == 1 && string.IsNullOrEmpty(CurrentUser.AccountPwd) &&
                  CurrentUser.LoginPwd.ToLower() == Encrypt.GetEncryptPwd(newpwd, CurrentUser.LoginName).ToLower())
            {
                msg = "资金密码不能喝登陆密码一致,操作失败";
            }
            else
            {
                if (type == 0)
                {
                    result=M_UsersBusiness.SetAdminAccount(CurrentUser.UserID, CurrentUser.LoginName, newpwd);
                    if (result)
                    { 
                        model.LoginPwd = Encrypt.GetEncryptPwd(newpwd, CurrentUser.LoginName);
                        Session["Manage"] = model;
                    }
                }
                else
                {
                    result = M_UsersBusiness.UpdateAccountPwd(CurrentUser.UserID, CurrentUser.LoginName, newpwd);
                    model.AccountPwd = Encrypt.GetEncryptPwd(newpwd, CurrentUser.LoginName);
                    Session["Manage"] = model; 
                }
            }
            JsonDictionary.Add("result", result);
            JsonDictionary.Add("ErrMsg", msg);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public JsonResult BindAccount(int type, string accountpwd, string account, string code)
        {
            var result = false;
            var contnext = true;
            var model = CurrentUser;
            string msg = "";
            if (string.IsNullOrEmpty(CurrentUser.AccountPwd))
            {
                contnext = false;
                msg = "资金密码未设置,操作失败";
            } 
            if (Encrypt.GetEncryptPwd(accountpwd, CurrentUser.LoginName).ToLower() !=
                CurrentUser.AccountPwd.ToLower())
            {
                contnext = false;
                 msg = "资金密码输入错误,操作失败";
            }

            if (contnext)
            {
                result = M_UsersBusiness.BindOtherAccount(type, CurrentUser.UserID, account, ref msg);
                if (result)
                {

                    if (type == 1)
                    {
                        model.Email = account;
                    }
                    else
                    {
                        model.MobilePhone = account;
                    }
                    Session["Manage"] = model;
                }
            }
            JsonDictionary.Add("result", result);
            JsonDictionary.Add("ErrMsg", msg);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public JsonResult BankList(   int pageIndex)
        {
            int total = 0;
            int pageCount = 0;
            var list = UserBanksBusiness.GetBanks("",CurrentUser.UserID, PageSize, pageIndex, ref total, ref pageCount);
            list.ForEach(x =>
            {
                if (!string.IsNullOrEmpty( x.CardCode) && x.CardCode.Length > 4)
                {
                    x.CardCode = x.CardCode.Replace(x.CardCode.Substring(0, x.CardCode.Length - 4), "*");
                }
            });
            JsonDictionary.Add("Items", list.Where(x=>x.Status!=9).ToList());
            JsonDictionary.Add("totalCount", total);
            JsonDictionary.Add("pageCount", pageCount);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public JsonResult BankCards(string accountpwd, string type = "MyCard")
        {
            type = string.IsNullOrEmpty(type) ? "MyCard" : type;
            var result
            =Encrypt.GetEncryptPwd(accountpwd, CurrentUser.LoginName).ToLower() ==
                CurrentUser.AccountPwd.ToLower() ;
            if (result)
            {
                var model = new SessionAccount() {Status = true, ExpTime = DateTime.Now.AddMinutes(10)};
                Session[type] = model;
            }
            JsonDictionary.Add("result", result);
            JsonDictionary.Add("ErrMsg", result?"":"资金密码错误!");
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult SaveBanks(string entity)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            UserBanks model = serializer.Deserialize<UserBanks>(entity);
            model.UserID = CurrentUser.UserID;
            string errmsg = "";
            var result =UserBanksBusiness.InsertBanks(model, ref errmsg);
            JsonDictionary.Add("result", result);
            if (!result)
            {
                JsonDictionary.Add("ErrMsg", errmsg);
            }
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public JsonResult DeleteBanks(string id)
        {  
            string errmsg = "";
            var result = UserBanksBusiness.UpdateStatus(id, 9);
            JsonDictionary.Add("result", result);
            if (!result)
            {
                JsonDictionary.Add("ErrMsg", "操作失败！");
            }
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public JsonResult LockBanks()
        {
            string errmsg = "";
            var result = UserBanksBusiness.UpdateStatus(CurrentUser.UserID);
            JsonDictionary.Add("result", result);
            if (!result)
            {
                JsonDictionary.Add("ErrMsg", "操作失败！");
            }
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        #endregion


    }
}
