using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ProEntity.UserAttr
{
    public class UserAddress
    {
        private int autoid;
        public int Autoid
        {
            get { return autoid; }
            set { autoid = value; }
        }

        private string userid;
        public string Userid
        {
            get { return userid; }
            set { userid = value; }
        }

        private string city;
        public string City
        {
            get { return city; }
            set { city = value; }
        }

        private string address;
        public string Address
        {
            get { return address; }
            set { address = value; }
        }

        private string postcode;
        public string Postcode
        {
            get { return postcode; }
            set { postcode = value; }
        }

        private string revicename;
        public string Revicename
        {
            get { return revicename; }
            set { revicename = value; }
        }

        private string phone;
        public string Phone
        {
            get { return phone; }
            set { phone = value; }
        }

        private short isdefault;
        public short Isdefault
        {
            get { return isdefault; }
            set { isdefault = value; }
        }

        private DateTime addtime;
        public DateTime Addtime
        {
            get { return addtime; }
            set { addtime = value; }
        }

    }
}
