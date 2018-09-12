﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using PrApi.Repositories;

namespace PrApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class ImagesController : Controller
    {

        private readonly IUserRepository _repository;
        private IHostingEnvironment _hostingEnvironment;

        public ImagesController(IUserRepository repository, IHostingEnvironment hostingEnvironment, IConfiguration con)
        {
            _repository = repository;
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpPost("UploadFile"), DisableRequestSizeLimit]
        public ActionResult UploadFile()
        {
            try
            {
                //recieve file and read details attached
                var file = Request.Form.Files[0];
                var assetId = HttpContext.Request.Form["assetId"];
                var imageTypeFolder = HttpContext.Request.Form["imageType"];
                string rootFolderName = "Uploads";
                string imageFolder = assetId;
                string apiPath = null;
                string webRootPath = _hostingEnvironment.WebRootPath;
              
                if (file.Length > 0)
                {
                    //get exstension and validate
                    string uploadFileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    string ext = Path.GetExtension(uploadFileName);
                    if (ext == ".jpg" || ext == ".jpeg" || ext == ".png")
                    {
                        int assetIdInt = Int32.Parse(assetId);
                        //creat timestamp for porperty images and room images
                        string time = DateTime.Now.ToString("hh.mm.ss.ffffff");
                        var fileName = imageTypeFolder.Equals("client") ? assetId + ext : assetId + time + ext;
                        apiPath = Path.Combine(imageTypeFolder, imageFolder, fileName);
                        //change path from explorer reference to url reference
                        apiPath = apiPath.Replace('\\', '/');
                        // var uri = new Uri(apiPath);

                        //3 different methods for each image type
                        if (imageTypeFolder.Equals("client"))
                        {
                            _repository.AddUserImage(assetIdInt, apiPath);
                        }

                        if (imageTypeFolder.Equals("room"))
                        {
                            _repository.AddRoomImage(assetIdInt, apiPath);
                        }

                        if (imageTypeFolder.Equals("property"))
                        {
                            _repository.AddPropertyImage(assetIdInt, apiPath);
                        }

                        //generate path based on data attached to image
                        var fullPath = Path.Combine(webRootPath, rootFolderName, apiPath);
                        string fileFolder = Path.Combine(webRootPath, rootFolderName, imageTypeFolder, imageFolder);
                        if (!Directory.Exists(fileFolder))
                        {
                            Directory.CreateDirectory(fileFolder);
                        }
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            file.CopyTo(stream);
                        }
                    }
                    return Json(apiPath);
                    
                    }
                return Json("Upload Failed, Please Ensure Image is either JPG, PNG or JPEG Format");
            }
            catch (System.Exception ex)
            {
                return Json("Upload Failed: " + ex.Message);
            }
        }
    }

}

