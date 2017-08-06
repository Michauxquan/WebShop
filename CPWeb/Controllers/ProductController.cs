using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CPiao.Controllers
{
    public class ProductController : Controller
    {
        //
        // GET: /Product/

        public ActionResult Index(string id)
        {
            return View();
        }
        public ActionResult Detail(string id)
        {
            ViewBag.ID = id;
            return View();
        }
    }
}
