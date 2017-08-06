using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using ProDAL.UserAttrs;
using ProEntity;

namespace ProBusiness.UserAttrs
{
    public class UserBanksBusiness
    {
        #region 查询
        /// <summary>
        /// 获取日志
        /// </summary>
        /// <returns></returns>
        public static List<UserBanks> GetBanks(string type, string userid,int pageSize, int pageIndex, ref int totalCount, ref int pageCount)
        {
            string tablename = "UserBanks  a ";

            string sqlwhere = " 1=1 "; 
            if (!string.IsNullOrEmpty(type))
            {
                sqlwhere += " and a.Type in(" + type + ")";
            }
            if (!string.IsNullOrEmpty(userid))
            {
                sqlwhere += " and a.userid='"+userid+"' ";
            }  
            DataTable dt = CommonBusiness.GetPagerData(tablename, "a.* ", sqlwhere, "a.AutoID ", pageSize, pageIndex, out totalCount, out pageCount);
            List<UserBanks> list = new List<UserBanks>();
            foreach (DataRow dr in dt.Rows)
            {
                UserBanks model = new UserBanks();
                model.FillData(dr);
                list.Add(model);
            }
            return list;
        }

        public static bool InsertBanks(UserBanks model,ref string errmsg)
        {
            return UserBanksDAL.BaseProvider.Create(model.UserID, model.CardCode, model.BankName, model.BankChild,
                model.TrueName, model.BankPre, model.BankCity, model.Type, ref errmsg);
        }

        public static int GetCount(string  userid)
        {
            return Convert.ToInt32(CommonBusiness.Select( "UserBanks","count(1)", " UserID='" + userid + "'"));
        }

        public static bool UpdateStatus(string autoids, int status)
        {
            return UserBanksDAL.BaseProvider.UpdateStatus(autoids, status);
        }
        public static bool UpdateStatus(string userid)
        {
            return UserBanksDAL.BaseProvider.UpdateStatus(userid);
        }
        #endregion
    }
}
