using AjaxDaTa.Model;
using System;
using System.Linq;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace AjaxJquery.Controllers
{
    public class HomeController : Controller
    {
        private EmployeeEntities _context;
        public HomeController()
        {
            _context = new EmployeeEntities();
        }
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public JsonResult LoadData(int page , int pageSize =3) // int page,pagezSize phaan trang
        {
            var model = _context.Employees.OrderByDescending(x=>x.Name).Skip((page - 1) * pageSize).Take(pageSize); // skip lấy từ vị trí nào
            int totalRow = _context.Employees.Count(); // tính tổn số trang
            return Json(new
            {
                //data = list,
                data = model,
                total = totalRow,
                Status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Update (string model)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer(); // chuyen doi json
            Employees empl = serializer.Deserialize<Employees>(model); // mep ping
            bool status = false;
            string message = string.Empty;

            // add new employee if id=0

            if (empl.ID == 0)
            {
                empl.CreatedDate = DateTime.Now;
                _context.Employees.Add(empl);

                try
                {
                    _context.SaveChanges();
                    status = true;
                }
                catch (Exception ex)
                {
                    status = false;
                    message = ex.Message;
                }
            }
            else
            {
                // cập nhật Db hiện có
                // save database
                var entity = _context.Employees.Find(empl.ID);
                entity.Salary = empl.Salary;
                entity.Name = empl.Name;
                entity.Status = empl.Status;
                try
                {
                    _context.SaveChanges();
                    status = true;
                }
                catch (Exception ex)
                {
                    status = false;
                    message = ex.Message;
                }
            }
           
            return Json(new
            {
                status = true
            });
        }

        public JsonResult SaveData (string strempl)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            Employees empl = serializer.Deserialize<Employees>(strempl);
            bool status = false;
            string message = string.Empty;
            if (empl.ID == 0)
            {
                empl.CreatedDate = DateTime.Now;
                _context.Employees.Add(empl);
                _context.SaveChanges();
                status = true;
            }
            else
            {
                // save db
                var entity = _context.Employees.Find(empl.ID);
                entity.Salary = empl.Salary;
                entity.Name = empl.Name;
                entity.Status = entity.Status;
                try
                {
                    _context.SaveChanges();
                    status = true;
                }
                catch (Exception ex)
                {
                    status = false;
                    message = ex.Message;
                }
            }

            return Json(new
            {
                status = status,
                message = message
            });
        }
    }
}