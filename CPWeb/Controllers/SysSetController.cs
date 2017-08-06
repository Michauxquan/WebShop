using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using ProBusiness;
using ProBusiness.Manage;
using ProEntity;
using ProEntity.Manage;

namespace CPiao.Controllers
{
    [CPiao.Common.UserAuthorize]
    public class SysSetController : BaseController
    {
        //
        // GET: /SysSet/

        public ActionResult Users()
        {
            ViewBag.Roles = ManageSystemBusiness.GetRoles();
            return View();
        }

        public ActionResult Role()
        {
            return View();
        }

        public ActionResult Active()
        {
            return View();
        }

        public ActionResult ActiveAdd()
        {
            return View();
        }

        public ActionResult ActiveDetail(string id = "")
        {
            ViewBag.Model = WebSetBusiness.GetActiveByID(id);
            return View();
        }

        public ActionResult Orders()
        {
            return View();
        }

        public ActionResult FeedBack()
        {
            return View();
        }

        public ActionResult RolePermission(string id)
        {
            ViewBag.Model = ManageSystemBusiness.GetRoleByID(id);
            ViewBag.Menus = CommonBusiness.ClientMenus.Where(m => m.PCode == ExpandClass.CLIENT_TOP_CODE).ToList();
            return View();
        } 
        public ActionResult Lottery()
        {
            return View();
        }
       
        #region Ajax
        #region Roles
        /// <summary>
        /// 获取角色列表
        /// </summary>
        /// <returns></returns>
        public JsonResult GetRoles()
        {
            var list = ManageSystemBusiness.GetRoles();
            JsonDictionary.Add("items", list);
            return new JsonResult()
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetRoleByID(string id)
        {
            var model = ManageSystemBusiness.GetRoleByID(id);
            JsonDictionary.Add("model", model);
            return new JsonResult()
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        /// <summary>
        /// 保存角色
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public JsonResult SaveRole(string entity)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            M_Role model = serializer.Deserialize<M_Role>(entity);

            if (string.IsNullOrEmpty(model.RoleID))
            {
                model.RoleID = new ManageSystemBusiness().CreateRole(model.Name, model.Description, string.Empty);
            }
            else
            {
                bool bl = new ManageSystemBusiness().UpdateRole(model.RoleID, model.Name, model.Description,
                    string.Empty);
                if (!bl)
                {
                    model.RoleID = "";
                }
            }
            JsonDictionary.Add("model", model);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        /// <summary>
        /// 删除角色
        /// </summary>
        /// <param name="roleid"></param>
        /// <returns></returns>
        public JsonResult DeleteRole(string roleid)
        {
            int result = 0;
            bool bl = new ManageSystemBusiness().DeleteRole(roleid, CurrentUser.UserID, OperateIP, out result);
            JsonDictionary.Add("status", result);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        #endregion

        /// <summary>
        /// 保存角色权限
        /// </summary>
        /// <param name="roleid"></param>
        /// <param name="permissions"></param>
        /// <returns></returns>
        public JsonResult SaveRolePermission(string roleid, string permissions)
        {
            if (permissions.Length > 0)
            {
                permissions = permissions.Substring(0, permissions.Length - 1);

            }
            bool bl = new ManageSystemBusiness().UpdateRolePermission(roleid, permissions, CurrentUser.UserID, OperateIP);
            JsonDictionary.Add("status", bl);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #region Users
        public JsonResult GetUsers(string keyWords, int pageIndex, int status = -1, int sourcetype = 1)
        {
            int totalCount = 0, pageCount = 0;
            var list = M_UsersBusiness.GetUsers(PageSize, pageIndex, ref totalCount, ref pageCount, sourcetype, status,
                keyWords);

            JsonDictionary.Add("Items", list);
            JsonDictionary.Add("totalCount", totalCount);
            JsonDictionary.Add("pageCount", pageCount);
            return new JsonResult()
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetUserDetail(string id)
        {
            var item = M_UsersBusiness.GetUserDetail(id);

            JsonDictionary.Add("Item", item);
            return new JsonResult()
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        /// <summary>
        /// 新增或修改用户
        /// </summary>
        public JsonResult ValidateLoginName(string loginName)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            JsonDictionary.Add("Info", M_UsersBusiness.GetM_UserCountByLoginName(loginName) > 0 ? "登录名已存在" : "");
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult SaveUser(string entity)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            M_Users model = serializer.Deserialize<M_Users>(entity);
            string mes = "执行成功";
            JsonDictionary.Add("ErrMsg", "执行成功");
            if (string.IsNullOrEmpty(model.UserID))
            {
                if (M_UsersBusiness.GetM_UserCountByLoginName(model.LoginName) == 0)
                {
                    model.CreateUserID = CurrentUser.UserID;
                    model.IsAdmin = 0;
                    model.SourceType = 1;
                    model.Type = 1; 
                    model.UserID = M_UsersBusiness.CreateM_User(model, ref mes);
                }
                else
                {
                    JsonDictionary["ErrMsg"] = "登录名已存在,操作失败";
                }
            }
            else
            {
                bool bl = M_UsersBusiness.UpdateM_UserRole(model.UserID, model.RoleID, model.Description);
                if (!bl)
                {
                    model.UserID = "";
                }
            }
            if (string.IsNullOrEmpty(model.UserID))
            {
                JsonDictionary["ErrMsg"] = "操作失败";
            }
            JsonDictionary.Add("model", model);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult DeleteMUser(string id)
        {

            bool bl = M_UsersBusiness.DeleteM_User(id, 9);
            JsonDictionary.Add("status", (bl ? 1 : 0));
            return new JsonResult()
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult UpdateUserStatus(string id, int status)
        {

            bool bl = M_UsersBusiness.UpdateM_UserStatus(id, status);
            JsonDictionary.Add("status", (bl ? 1 : 0));
            return new JsonResult()
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        #endregion

        #region FeedBacks
        /// <summary>
        /// 获取举报反馈信息
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="type"></param>
        /// <param name="status"></param>
        /// <param name="keyWords"></param>
        /// <param name="beginDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
        public JsonResult GetFeedBacks(int pageIndex, int type, int status, string keyWords, string beginDate,
            string endDate)
        {

            int totalCount = 0, pageCount = 0;
            var list = FeedBackBusiness.GetFeedBacks(keyWords, beginDate, endDate, type, status, "", PageSize, pageIndex,
                out totalCount, out pageCount);
            JsonDictionary.Add("Items", list);
            JsonDictionary.Add("TotalCount", totalCount);
            JsonDictionary.Add("PageCount", pageCount);

            return new JsonResult()
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetFeedBackDetail(string id)
        {
            var item = FeedBackBusiness.GetFeedBackDetail(id);
            JsonDictionary.Add("Item", item);

            return new JsonResult()
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult UpdateFeedBackStatus(string id, int status, string content)
        {
            bool flag = FeedBackBusiness.UpdateFeedBackStatus(id, status, content);
            JsonDictionary.Add("Result", flag ? 1 : 0);

            return new JsonResult()
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        #endregion

        #region Active
        public JsonResult GetActiveList(string keywords, int pageIndex, int pageSize, string btime = "",
            string etime = "", int type = -1)
        {
            int totalCount = 0, pageCount = 0;
            JsonDictionary.Add("items",
                WebSetBusiness.GetActiveList(keywords, pageIndex, pageSize, ref totalCount, ref pageCount, btime, etime,
                    type));
            JsonDictionary.Add("TotalCount", totalCount);
            JsonDictionary.Add("PageCount", pageCount);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetActiveByID(string id)
        {
            var item = WebSetBusiness.GetActiveByID(id);
            JsonDictionary.Add("Item", item);
            return new JsonResult()
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult DeleteActive(int autoid)
        {
            JsonDictionary.Add("result", WebSetBusiness.DeleteActive(autoid));
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        [ValidateInput(false)]
        public JsonResult SaveActive(string entity)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            Active model = serializer.Deserialize<Active>(entity);
            var result = false;
            if (model.AutoID == -1)
            {
                model.CreateUserID = CurrentUser.UserID;
                result = WebSetBusiness.InsertActive(model);
            }
            else
            {
                model.UpdUserID = CurrentUser.UserID;
                result = WebSetBusiness.UpdateActive(model);
            }
            JsonDictionary.Add("result", result);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        #endregion

        #region Ordes

        public JsonResult OrdersList(int paytype, int status, string keywords, string userID, string beginTime,
            string endTime, int pageIndex, int pageSize)
        {
            int totalCount = 0;
            int pageCount = 0;
            var result = UserOrdersBusiness.GetUserOrders(keywords, userID, -1, status, paytype, pageSize, pageIndex,
                ref totalCount, ref pageCount, beginTime, endTime);
            JsonDictionary.Add("totalCount", totalCount);
            JsonDictionary.Add("pageCount", pageCount);
            JsonDictionary.Add("items", result);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult BoutOrder(string ordercode)
        {
            var result = UserOrdersBusiness.BoutOrder(ordercode);
            JsonDictionary.Add("result", result);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult OrderAuditing(string ordercode)
        {
            string msg = "";
            var result = false;
            var model = UserOrdersBusiness.GetUserOrderDetail(ordercode);
            if (model != null && model.Status == 0)
            {
                result = UserOrdersBusiness.OrderAuditting(ordercode, "", model.TotalFee);
            }
            else
            {
                msg = "订单状态不正确";
            }
            JsonDictionary.Add("errorMsg", msg);
            JsonDictionary.Add("result", result);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult SaveOrders(string entity)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            UserOrders model = serializer.Deserialize<UserOrders>(entity);
            model.SPName = "";
            string error = "";
            var result =false;
            if (model.AutoID==-1)
            {
                var tempu=M_UsersBusiness.GetUserDetailByLoginName(model.UserName);
                if (tempu != null && !string.IsNullOrEmpty(tempu.UserID))
                {
                    result = UserOrdersBusiness.CreateUserOrder(
                        DateTime.Now.ToString("yyyyMMddhhmmss") + CurrentUser.AutoID, model.PayType, model.SPName,
                        model.BankName, model.Sku, model.Content, model.TotalFee, model.OtherCode,
                        Convert.ToInt32(model.TotalFee), model.Type, model.PayFee, tempu.UserID, CurrentUser.UserID,OperateIP);
                }
                else
                {
                    error = "登陆账号不存在,订单登记失败";
                }
            }
            JsonDictionary.Add("result", result);
            JsonDictionary.Add("ErrMsg", error);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #endregion

        #region Lotterys

        public JsonResult GetLotterys()
        { 
            JsonDictionary.Add("items",  CommonBusiness.LottertList);
            return new JsonResult()
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetLotteryByID(int autoid)
        {
            var model = WebSetBusiness.GetLotteryDetailByID(autoid);
            JsonDictionary.Add("model", model);
            return new JsonResult()
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public JsonResult SaveLottery(string entity)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            Lottery model = serializer.Deserialize<Lottery>(entity);
            string errmsg = "";
            if (model.AutoID<1)
            {
                model.AutoID = WebSetBusiness.CreateLottery(model.CPName, model.CPCode, model.IconType, model.ResultUrl, CurrentUser.UserID,model.OpenTimes,model.CloseTime,model.OnSaleTime,model.SealTimes,model.PeriodsNum, ref errmsg);
            }
            else
            {
                bool bl = WebSetBusiness.UpdateLottery(model.CPName, model.CPCode, model.IconType, model.ResultUrl, model.OpenTimes, model.CloseTime, model.OnSaleTime, model.SealTimes, model.PeriodsNum, model.AutoID);
                if (!bl)
                {
                    model.AutoID = 0;
                }
            }
            JsonDictionary.Add("model", model);
            JsonDictionary.Add("ErrMsg", errmsg);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public JsonResult DeleteLottery(int autoid,int status)
        { 
            bool bl = WebSetBusiness.UpdateUserLottery(status, autoid);
            JsonDictionary.Add("status", bl);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
         

        #endregion

        #endregion
    }
}
