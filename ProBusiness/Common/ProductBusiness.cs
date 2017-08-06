using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using ProDAL;
using ProDAL.Manage;
using ProDAL.UserAttrs;
using ProEntity;
using ProEntity.Manage;

namespace ProBusiness
{
    public class ProductBusiness
    {
        public static ProductBusiness BaseBusiness = new ProductBusiness();

        #region 查询

        public static List<Product> GetProductList(string pname, string typecode, string pcode, int page, int pagesize, ref int totalcount,
            ref int pagecount, string orderclum = "", bool orderby = false)
        {
            string sqlwhere = " 1=1 ";
            if (!string.IsNullOrEmpty(pname))
            {
                sqlwhere += " and productname like '%"+pname+"%' ";
            }
            if (!string.IsNullOrEmpty(typecode))
            {
                sqlwhere += " and typecode='"+typecode+"' ";
            }
            if (!string.IsNullOrEmpty(pcode))
            {
                sqlwhere += " and productcode='"+pcode+"' ";
            }
            DataTable dt = CommonBusiness.GetPagerData("products", "*", sqlwhere, "Autoid", orderclum, pagesize, page,
                out totalcount, out page, orderby);
            List<Product> list=new List<Product>();
            foreach (DataRow row in dt.Rows)
            {
                Product pt=new Product();
                pt.FillData(row);
                list.Add(pt);
            }
            return list;
        }
        public static Product GetProductDetail(int id)
        {
            DataTable dt = M_UsersDAL.GetDataTable("select  *  from products where autoid=" + id);
            Product pt = new Product();
            foreach (DataRow row in dt.Rows)
            { 
                pt.FillData(row);
               
            }
            return pt;
        }
        #endregion

        #region 添加.删除



       public static int CreateUserOrderList(List<LotteryOrder> models, M_Users user,string ip,int usedisFee,int palytype,ref string errmsg )
       {
           int k = 0;
           string msg = "";
           models.ForEach(x =>
           {
               string errormsg = "";
               string orderCode = DateTime.Now.ToString("yyyyMMddhhMMssfff") + user.AutoID;
               var result = CreateLotteryOrder(orderCode, x.IssueNum, x.Type,x.TypeName,x.CPCode, x.CPName, x.Content.Replace("\"",""),
                   x.Num, x.PayFee, user.UserID, x.PMuch, x.RPoint, ip, usedisFee,palytype, "",ref errormsg);
               if (!result)
               {
                   msg += x.Content + "    " + errormsg+"/n";
               }
               else
               {
                   k++;
               }
           });
           errmsg = msg;
           return k;
       }

       public static bool CreateLotteryOrder(string ordercode, string issueNum, string type, string typename,string cpcode, string cpname, string content,  int num,
           decimal payfee, string userID, int pmuch, decimal rpoint, string operatip,int usedisFee,int palytype, string bCode,ref string errormsg)
       {
           var orderid = Guid.NewGuid().ToString();
           return LotteryOrderDAL.BaseProvider.CreateLotteryOrder(ordercode, orderid,issueNum, type, cpcode, cpname, content, typename, num,
            payfee, userID, pmuch, rpoint, operatip, usedisFee, palytype, bCode,ref errormsg);
       }
        public static bool DeleteOrder(string ordercode)
        {
            bool bl = CommonBusiness.Update("LotteryOrder", "Status", 9, "LCode='" + ordercode + "'");
            return bl;
        }
        public static bool BoutOrder(string ordercode)
        {
            bool bl = CommonBusiness.Update("LotteryOrder", "Status", 3, "LCode='" + ordercode + "' and Status=0");
            return bl;
        }


        public static int CreateBettOrderList(List<LotteryBettAuto> models, M_Users user, string ip, int isStart, ref string errmsg)
        {
            int k = 0;
            string msg = "";
            models.ForEach(x =>
            {
                string errormsg = "";
                string orderCode = DateTime.Now.ToString("yyyyMMddhhMMssfff") + user.AutoID;
                var result = CreateBettOrder(orderCode, x.StartNum, x.Type, x.TypeName, x.CPCode, x.CPName, x.Content.Replace("\"", ""),
                    x.Num, x.PayFee, user.UserID, x.PMuch, x.RPoint, ip, isStart,x.BettNum,x.BMuch,x.TotalFee,x.Profits,x.WinFee, x.BettType,x.JsonContent,ref errormsg);
                if (!result)
                {
                    msg += x.Content + "    " + errormsg + "/n";
                }
                else
                {
                    k++;
                }
            });
            errmsg = msg;
            return k;
        }
        public static bool CreateBettOrder(string ordercode, string issueNum, string type, string typename, string cpcode, string cpname, string content, int num, decimal payfee, string userID,
           int pmuch, decimal rpoint, string operatip, int isStart, int bettnum, int bmuch, decimal totalfee, decimal profits, decimal winfee, int bettType,string jsonContent, ref string errormsg)
        { 
            return LotteryOrderDAL.BaseProvider.CreateBettOrder(ordercode,  issueNum, type, typename, cpcode, cpname, content, num,
             payfee, userID, pmuch, rpoint, operatip, isStart, bettnum, bmuch, totalfee, profits, winfee,bettType,jsonContent, ref errormsg);
        }
       #endregion 

        #region 修改

       public static bool UpdateBettAutoByCode(string bCode, int comnum,decimal comfee, string remark)
       {
           return LotteryOrderDAL.BaseProvider.UpdateBettAutoByCode(bCode, comnum,comfee, remark);
       }

       #endregion
        
    }
}
