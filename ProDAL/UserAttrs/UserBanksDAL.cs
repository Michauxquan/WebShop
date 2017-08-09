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
        /// <summary>
        /// 收货地址
        /// </summary>
        
        public bool Add(string userid,string city, string postcode, string address, string phone, string reciveName)
        {

            SqlParameter[] paras =
           {
               new SqlParameter("@userid", userid),
               new SqlParameter("@city", city),
               new SqlParameter("@address", address),
               new SqlParameter("@postcode", postcode),
               new SqlParameter("@revicename", reciveName),
               new SqlParameter("@phone", phone)
               
           };
            string sql = string.Format(@"INSERT INTO [dbo].[UserDelAddress]
           ([userid]
           ,[city]
           ,[address]
           ,[postcode]
           ,[revicename]
           ,[phone]
           ,[isdefault])
     VALUES
           (@userid
           ,@city
           ,@address
           ,@postcode
           ,@revicename
           ,@phone
           ,0
           )");
            return ExecuteNonQuery(sql, paras, CommandType.Text) > 0;
        }

        /// <summary>
        /// 收货地址
        /// </summary>
       
        public bool Edit(string userid,int auotid, string city, string postcode, string address, string phone, string reciveName)
        {

            SqlParameter[] paras =
           {
               new SqlParameter("@userid", userid),
               new SqlParameter("@auotid", auotid),
               new SqlParameter("@city", city),
               new SqlParameter("@address", address),
               new SqlParameter("@postcode", postcode),
               new SqlParameter("@revicename", reciveName),
               new SqlParameter("@phone", phone)
               
           };
            string sql = string.Format(@"UPDATE [dbo].[UserDelAddress]
   SET [city] = @city
      ,[address] = @address
      ,[postcode] = @postcode
      ,[revicename] = @revicename
      ,[phone] = @phone
 WHERE auotid=@auotid");
            return ExecuteNonQuery(sql, paras, CommandType.Text) > 0;
        }

        public bool Del(int autoid)
        {
            string sql = string.Format(@"delete a from [dbo].[UserDelAddress] a WHERE auotid=@auotid");
            return ExecuteNonQuery(sql) > 0;
        }
        public DataTable GetAddress(string condition = "")
        {
            string sql = string.Format(@"select * from UserDelAddress {0}",condition);
            return GetDataTable(sql);
            
        }
    }
}
