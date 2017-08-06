using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ProBusiness;

namespace CPiao.Controllers
{
    public class ProductController : BaseController
    {
        //
        // GET: /Product/ 
        public ActionResult Index(string id="",string pname="")
        {
            ViewBag.ID = id;
            ViewBag.PName = pname;
            return View();
        }
        public ActionResult Detail(string id)
        {
            ViewBag.ID = id;
            return View();
        }

        public ActionResult BalanceOrder(string baseinfo)
        {
            if (CurrentUser != null)
            {
                return Redirect("/Home/Login");
            }
            ViewBag.BaseInfo = baseinfo;
            return View();
        }
        #region Ajax

        public JsonResult GetProductList(string id="",string pname="")
        {
            int totalcount = 0;
            int pagecount = 0;
            var list = ProductBusiness.GetProductList(pname.Trim(), id.Trim(), "", 1, 20, ref totalcount, ref pagecount);
            JsonDictionary.Add("items", list);
            return new JsonResult()
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetProductDetail(int id=0)
        {
            int totalcount = 0;
            int pagecount = 0;
            var item = ProductBusiness.GetProductDetail(id);
            JsonDictionary.Add("item", item);
            return new JsonResult()
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #endregion
    }
}
