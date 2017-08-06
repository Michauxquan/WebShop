using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace ProDAL.UserAttrs
{
    public class UserBanksDAL : BaseDAL
    {
        public static UserBanksDAL BaseProvider = new UserBanksDAL();
        public bool Create(string userID, string cardcode, string bankname, string bankchild, string truename, string bankpre, string bankcity,int type, ref string errormsg)
        { 
            SqlParameter[] paras = { 
                                    new SqlParameter("@ErrorMsg" , SqlDbType.VarChar,300),
                                    new SqlParameter("@Result",SqlDbType.Int),
                                    new SqlParameter("@UserID",userID), 
                                    new SqlParameter("@Cardcode",cardcode),
                                    new SqlParameter("@TrueName",truename),
                                    new SqlParameter("@BankChild",bankchild),
                                    new SqlParameter("@BankPre",bankpre),
                                    new SqlParameter("@BankCity",bankcity),
                                    new SqlParameter("@BankName",bankname),
                                    new SqlParameter("@Type",type)
                                   };
            paras[0].Direction = ParameterDirection.Output;
            paras[1].Direction = ParameterDirection.Output;
            ExecuteNonQuery("P_InsertUserBanks", paras, CommandType.StoredProcedure);
            var result = Convert.ToInt32(paras[1].Value);
            errormsg = paras[0].Value.ToString();
            return result > 0;
        }
        public bool UpdateStatus(string userid)
        {
            SqlParameter[] paras =
           {
               new SqlParameter("@UserID", userid) 
           };
            return ExecuteNonQuery("update UserBanks set Status=9 where UserID =@UserID", paras, CommandType.Text) > 0;

        }
        public bool UpdateStatus(string autoids, int status)
        {
            SqlParameter[] paras =
           {
               new SqlParameter("@AutoID", autoids),
               new SqlParameter("@Status", status)
           };
            return ExecuteNonQuery("update UserBanks set Status=@Status where AutoID =@AutoID", paras, CommandType.Text) > 0;

        }
    }
}
