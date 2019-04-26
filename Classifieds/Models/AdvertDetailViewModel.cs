﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Classifieds.Web.Models
{
    public class AdvertDetailViewModel
    {

        public long ID { set; get; }

        [Required(ErrorMessage ="Please enter title")]
        [Display(Name ="Title")]
        public String Title { set; get; }

        [Required(ErrorMessage = "Body cannot be empty")]
        [Display(Name = "Body")]
        public String Body { set; get; }

        [Required(ErrorMessage = "Please enter email address")]
        [EmailAddress(ErrorMessage ="Invalid email address")]
        [Display(Name = "Email Address")]
        public String Email { set; get; }

        [Phone(ErrorMessage ="Invalid phone number")]
        [Display(Name = "Phone Number")]
        public String Phone { set; get; }

        [Required(ErrorMessage = "Please choose location")]
        [Display(Name = "Location")]
        public String Location { set; get; }

        public long AdvertID { set; get; }
        public AdvertViewModel Advert { set; get; }

        public String GroupCdn { set; get; }
        public int? GroupCount { set; get; }
        public long? GroupSize { set; get; }
        public String GroupUuid { set; get; }

        public virtual List<AdPictureViewModel> AdPictures { set; get; }
    }
}
