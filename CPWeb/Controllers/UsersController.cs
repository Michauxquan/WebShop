using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using ProBusiness;
using ProBusiness.Common;
using ProBusiness.UserAttrs;
using ProEntity;
using ProEntity.Manage;

namespace CPiao.Controllers
{
    [CPiao.Common.UserAuthorize]
    public class UserController : BaseController
    {
        //
        // GET: /User/

        public ActionResult UserList(string id="")
        {
            ViewBag.UserID = id; 
            ViewBag.Layers = CurrentUser.Layers;
            return View();
        }

        public ActionResult UserAdd()
        {
            var model = M_UsersBusiness.GetUserDetail(CurrentUser.UserID); 
            return View();
        }
        public ActionResult UserEdit()
        {
            var model = M_UsersBusiness.GetUserDetail(CurrentUser.UserID);
            var  logmd=LogBusiness.GetLogsByUserID(CurrentUser.UserID,2);
            ViewBag.UserName = model.UserName;
            ViewBag.LastIP = model.LastLoginIP == "::1"?"127.0.0.1":model.LastLoginIP ; 
            ViewBag.LastTime = logmd.CreateTime.ToString("yyyy-MM-dd HH:mm:ss"); 
            return View();
        }
        public ActionResult UserMsg()
        {
            var list = M_UsersBusiness.GetUsersListByParent(CurrentUser.UserID);
            ViewBag.Childs = list;
            var model = M_UsersBusiness.GetParentByChildID(CurrentUser.UserID);
            ViewBag.ParentID = model != null ? model.ParentID : "";
            return View();
        }

        public ActionResult UserReward()
        { 
            ViewBag.LoginName = CurrentUser.LoginName;
            ViewBag.UserName = CurrentUser.UserName; 
            return View();
        }

        public ActionResult UserSpread()
        {
            ViewBag.ID = CurrentUser.UserID; 
            return View();
        }
        public ActionResult UserInfo()
        {
            if (CurrentUser == null)
            {
                return Redirect("/Home/Login");
            }
            return View();
        }
        public ActionResult Default()
        {
            if (CurrentUser == null)
            {
                return Redirect("/Home/Login");
            } 
            return View();
        }
        public ActionResult Order()
        {
            if (CurrentUser == null)
            {
                return Redirect("/Home/Login");
            }
            return View();
        }
        public ActionResult AccountChange()
        {
            if (CurrentUser == null)
            {
                return Redirect("/Home/Login");
            }
            return View();
        }

        public ActionResult UserBank()
        {
            if (CurrentUser == null)
            {
                return Redirect("/Home/Login");
            }
            return View();
        }

        #region Ajax

        public JsonResult UserInfoList(int type, bool orderby, string username, string userid, string accountmin, string accountmax, string clumon, string rebatemin, string rebatemax, int pageIndex, int pageSize, bool mytype=false)
        {
            int total = 0;
            int pageCount = 0;
            var list = M_UsersBusiness.GetUsersRelationList(pageSize, pageIndex, ref total, ref pageCount, string.IsNullOrEmpty(userid)?CurrentUser.UserID:userid, type, -1, username, clumon, orderby, rebatemin, rebatemax, accountmin, accountmax, mytype);
            
            JsonDictionary.Add("items", list);
            JsonDictionary.Add("totalCount", total);
            JsonDictionary.Add("pageCount", pageCount);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        [HttpPost]
        public JsonResult UserAdd(int type, string username, string loginpwd, string loginname, decimal rebate)
        {
            string Errmsg = "";
            M_Users user=new M_Users()
            {
                Type = type,
                SourceType = 0, 
                UserName = username,
                LoginName = loginname,
                LoginPwd = loginpwd,
                Description="用户新增", 
                RoleID=(type==1?"dd87ca0a-b425-4e1e-b7ec-7a1e02dad0f8":"48eb0491-d92c-4664-ab27-37320ac7de38")
            };
            var result = M_UsersBusiness.CreateM_User(user, ref Errmsg);
            JsonDictionary.Add("result", result);
            JsonDictionary.Add("Errmsg", Errmsg);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        [HttpPost]
        public JsonResult UserEdit(string username)
        {
            string Errmsg = ""; 
            var result = M_UsersBusiness.UpdateM_UserName(CurrentUser.UserID, username);
            if (result)
            {
                var model = CurrentUser;
                model.UserName = username;
                Session["Manage"] = model;
            }
            JsonDictionary.Add("result", result); 
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        [HttpPost]
        public JsonResult UserDelete(string id)
        {
            var result = M_UsersBusiness.DeleteM_User(id,9);
            JsonDictionary.Add("result", result);
            JsonDictionary.Add("ErrMsg", result?"":"删除失败,请稍后再试");
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        [HttpPost]
        public JsonResult UserUpdPoint(string id,decimal addpoint)
        {
            var result = M_UsersBusiness.UpdateM_UserRebate(id, CurrentUser.UserID, addpoint);
            if (result)
            {
                var model = CurrentUser; 
                Session["Manage"] = model;
            }
            JsonDictionary.Add("result", result);
            JsonDictionary.Add("ErrMsg", result ? "" : "配置失败,请稍后再试");
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        [HttpPost]
        public JsonResult GetChildList(string userid="",bool type=false)
        {
            var list=M_UsersBusiness.GetUsersRelationList(userid==""?CurrentUser.UserID:userid, type);
            JsonDictionary.Add("items", list);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetUserAccount()
        {
            //var model = M_UsersBusiness.GetUserAccount(CurrentUser.UserID);
            //JsonDictionary.Add("item", model);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetMsgList(int type,int pageIndex)
        {
            int total = 0;
            int pageCount = 0;
            var list = UserReplyBusiness.GetUserReplys(CurrentUser.UserID, "", type, PageSize, pageIndex, ref total,
                ref pageCount);
            JsonDictionary.Add("items", list);
            JsonDictionary.Add("totalCount", total);
            JsonDictionary.Add("pageCount", pageCount);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };

        }

        public JsonResult SaveReply(string entity)
        {
            var result = false;
            string msg = "提交失败，请稍后再试！"; 
            UserReply model = JsonConvert.DeserializeObject<UserReply>(entity); 
            model.FromReplyID = string.IsNullOrEmpty(model.FromReplyID) ? "" : model.FromReplyID;
            model.FromReplyUserID = string.IsNullOrEmpty(model.FromReplyUserID) ? "" : model.FromReplyUserID;
            result = UserReplyBusiness.CreateUserReply(model.GUID.Replace("ZSXJ,",""), model.Content,model.Title, CurrentUser.UserID, model.FromReplyID, model.FromReplyUserID, model.Type, model.GUID.IndexOf("ZSXJ,"), ref msg); 
            JsonDictionary.Add("result", result);
            JsonDictionary.Add("ErrMsg", msg);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult UpdStatus(string ids,int status)
        {
            var result = false;
            string msg = "提交失败，请稍后再试！";
            result=UserReplyBusiness.UpdateReplyStatus(ids.TrimEnd(',').Replace(",","','"), status);
            JsonDictionary.Add("result", result);
            JsonDictionary.Add("ErrMsg", msg);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult ReplyDetail(string id)
        {
            var model = UserReplyBusiness.GetReplyDetail(id);
            JsonDictionary.Add("Item", model); 
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #endregion

    }
}
