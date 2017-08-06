using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace ProDAL.Manage
{
    public class M_UsersDAL : BaseDAL
    {
        public static M_UsersDAL BaseProvider = new M_UsersDAL();

        public DataTable GetM_UserByUserName(string loginname, string pwd)
        {

            SqlParameter[] paras = { 
                                    new SqlParameter("@UserName",loginname),
                                    new SqlParameter("@LoginPwd",pwd)
                                   };
            return GetDataTable("select * from M_Users where LoginName=@UserName and LoginPwd=@LoginPwd and Status=1", paras, CommandType.Text);
        }
        public DataSet GetM_UserByProUserName(string loginname, string pwd, int sourceType,out int result)
        {
            result = 0;
            SqlParameter[] paras = {
                                    new SqlParameter("@Result",result),
                                    new SqlParameter("@LoginName",loginname),
                                    new SqlParameter("@LoginPwd",pwd),
                                    new SqlParameter("@SourceType",sourceType)
                                   };
            paras[0].Direction = ParameterDirection.Output;
            DataSet ds = GetDataSet("M_GetM_UserToLogin", paras, CommandType.StoredProcedure, "M_User|Permission");
            result = Convert.ToInt32(paras[0].Value);

            return ds;
        }
        public DataTable GetM_UserByLoginName(string loginname)
        {

            SqlParameter[] paras = { 
                                    new SqlParameter("@LoginName",loginname)
                                   };
            return GetDataTable("select * from M_Users where LoginName=@LoginName and Status<>9", paras, CommandType.Text);
        }
        public DataTable GetUserDetail(string userID)
        {

            SqlParameter[] paras = { 
                                    new SqlParameter("@UserID",userID)
                                   };

            return GetDataTable("select * from M_Users where UserID=@UserID", paras, CommandType.Text);
        } 
        public bool SetAdminAccount(string userid,string loginname, string pwd)
        {

            SqlParameter[] paras = { 
                                    new SqlParameter("@userID",userid),
                                    new SqlParameter("@UserName",loginname),
                                    new SqlParameter("@LoginPwd",pwd)
                                   };

            return ExecuteNonQuery("update M_Users set LoginName=@UserName , LoginPwd=@LoginPwd where userID=@userID", paras, CommandType.Text) > 0;
        }
         
        public bool UpdateUserAccount(string userid, decimal golds,int  type,string remark)
        {
            SqlParameter[] paras = { 
                                    new SqlParameter("@Result",SqlDbType.Int),
                                    new SqlParameter("@UserID",userid),
                                    new SqlParameter("@Type",type),
                                    new SqlParameter("@Golds",golds),
                                    new SqlParameter("@Remark",remark)
                                   };
            paras[0].Direction = ParameterDirection.Output;
            ExecuteNonQuery("M_UserAccountChange", paras, CommandType.StoredProcedure);
            var result = Convert.ToInt32(paras[0].Value);
            return result > 0;
        }

        public bool CreateM_User(string userid, string loginname, string loginpwd, string username,  int sourceType, int type,   string roleid, out string errormsg, string Description)
        {
            SqlParameter[] paras = { 
                                    new SqlParameter("@ErrorMsg" , SqlDbType.VarChar,300),
                                    new SqlParameter("@Result",SqlDbType.Int),
                                    new SqlParameter("@UserID",userid),
                                    new SqlParameter("@LoginName",loginname),
                                    new SqlParameter("@LoginPwd",loginpwd),
                                    new SqlParameter("@SourceType",sourceType),
                                    new SqlParameter("@RoleID",roleid),
                                    new SqlParameter("@Description",Description), 
                                    new SqlParameter("@Type",type),  
                                    new SqlParameter("@UserName",username) 
                                   };
            paras[0].Direction = ParameterDirection.Output;
            paras[1].Direction = ParameterDirection.Output;
            ExecuteNonQuery("M_InsertUser", paras, CommandType.StoredProcedure);
            var result = Convert.ToInt32(paras[1].Value);
            errormsg = paras[0].Value.ToString();
            return result>0;
        }
        public bool BindOtherAccount(string userid,int  type,string accountcode,ref string errormsg)
         {
            SqlParameter[] paras = { 
                                    new SqlParameter("@ErrorMsg" , SqlDbType.VarChar,300),
                                    new SqlParameter("@Result",SqlDbType.Int),
                                    new SqlParameter("@UserID",userid),
                                    new SqlParameter("@Type",type),
                                    new SqlParameter("@AccountCode",accountcode) 
                                   };
            paras[0].Direction = ParameterDirection.Output;
            paras[1].Direction = ParameterDirection.Output;
            ExecuteNonQuery("M_BindOtherAccount", paras, CommandType.StoredProcedure);
            var result = Convert.ToInt32(paras[1].Value);
            errormsg = paras[0].Value.ToString();
            return result>0;
        }
        public bool CreateM_UserBase(string userid, string loginname, string loginpwd)
        {
            string sql = "INSERT INTO M_Users(UserID,LoginName ,LoginPWD,Status) " +
                        " values(@UserID,@LoginName,@LoginPWD,0)";

            SqlParameter[] paras = { 
                                       new SqlParameter("@UserID",userid),
                                       new SqlParameter("@LoginName",loginname),
                                       new SqlParameter("@LoginPWD",loginpwd)
                                   };

            return ExecuteNonQuery(sql, paras, CommandType.Text) > 0;
        } 
        public bool UpdateM_User(string userid, string avatar)
        {
            string sql = "update M_Users set Avatar=@Avatar where UserID=@UserID ";

            SqlParameter[] paras = {  
                                       new SqlParameter("@UserID",userid),
                                       new SqlParameter("@Avatar",avatar)
                                   };

            return ExecuteNonQuery(sql, paras, CommandType.Text) > 0;
        }
        public bool UpdateM_UserRole(string userid, string roleid,string Description)
        {
            string sql = "update M_Users set RoleID=@RoleID,Description=isnull(Description,'')+@Description where UserID=@UserID ";

            SqlParameter[] paras = {  
                                       new SqlParameter("@UserID",userid),
                                        new SqlParameter("@RoleID",roleid),
                                       new SqlParameter("@Description",Description)
                                   };

            return ExecuteNonQuery(sql, paras, CommandType.Text) > 0;
        }
        public bool UpdateM_UserName(string userid, string username)
        {
            string sql = "update M_Users set UserName=@UserName where UserID=@UserID ";

            SqlParameter[] paras = {  
                                       new SqlParameter("@UserID",userid),
                                       new SqlParameter("@UserName",username)
                                   };
            return ExecuteNonQuery(sql, paras, CommandType.Text) > 0;
        }  
        public bool DeleteM_User(string userid, int status)
        {
            SqlParameter[] paras = { 
                                    new SqlParameter("@userID",userid),
                                    new SqlParameter("@Status",status),
                                   };

            return ExecuteNonQuery("update M_Users set Status=@Status where userID=@userID", paras, CommandType.Text) > 0;
        }
        public bool UpdateM_UserStatus(string userid, int status)
        {
            SqlParameter[] paras = { 
                                    new SqlParameter("@userID",userid),
                                    new SqlParameter("@Status",status),
                                   };

            return ExecuteNonQuery("update M_Users set Status=@Status where userID=@userID and Status not in (9)", paras, CommandType.Text) > 0;
        }
        public bool UpdateM_UserRebate(string userid,string parentid, decimal point,SqlTransaction tran)
        {
            SqlParameter[] paras = { 
                                    new SqlParameter("@userID",userid),
                                    new SqlParameter("@ParentID",parentid),
                                    new SqlParameter("@Rebate",point),
                                   };

            return ExecuteNonQuery(tran, @"if((select UsableRebate-@Rebate  from M_Users where userID=@ParentID)>0)  
                                         begin  
                                         update M_Users set Rebate=Rebate+@Rebate,UsableRebate=UsableRebate+@Rebate where userID=@userID and Status !=9  
                                         update M_Users set UsableRebate=UsableRebate-@Rebate where userID=@ParentID end", paras, CommandType.Text) > 0;
        }
        public bool Update_userLevel(string userid, string levelID)
        {
            SqlParameter[] paras = { 
                                    new SqlParameter("@userID",userid),
                                    new SqlParameter("@LevelID",levelID),
                                   };

            return ExecuteNonQuery("update M_Users set LevelID=@LevelID where userID=@userID", paras, CommandType.Text) > 0;
        }
        public bool UpdateAccountPwd(string userid, string pwd)
        {
            SqlParameter[] paras = { 
                                    new SqlParameter("@UserID",userid),
                                    new SqlParameter("@AccountPwd",pwd),
                                   };

            return ExecuteNonQuery(" declare @acct int select  @acct= case isnull(AccountPwd,'') when '' then SafeLevel+15 else SafeLevel end from M_Users where  UserID=@UserID update M_Users set AccountPwd=@AccountPwd,SafeLevel=@acct where UserID=@UserID", paras, CommandType.Text) > 0;
        }
        public bool UpdatePwd(string loginname, string pwd)
        {
            SqlParameter[] paras = { 
                                    new SqlParameter("@LoginName",loginname),
                                    new SqlParameter("@LoginPwd",pwd),
                                   };

            return ExecuteNonQuery("update M_Users set LoginPwd=@LoginPwd where LoginName=@LoginName", paras, CommandType.Text) > 0;
        }
    }
}
