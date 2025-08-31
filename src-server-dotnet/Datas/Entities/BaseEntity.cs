using MyApiDotnet8.Helpers;
using MyApiDotnet8.Commons.Enums;
using System.ComponentModel.DataAnnotations;

namespace MyApiDotnet8.Data.Entities
{
    public class BaseEntity<T> where T : BaseEntity<T>
    {
        public T SetInsertParams(string? loggedUserId = null)
        {
            Id = StringHelpers.GenerateId();
            CreateTime = DateTimeHelpers.Timestamp(DateTimeHelpers.Now()).ToString();
            CreateUser = loggedUserId;
            UpdateTime = DateTimeHelpers.Timestamp(DateTimeHelpers.Now()).ToString();
            UpdateUser = loggedUserId;
            Status = Status.Active;
            return (T)this;
        }

        public T SetUpdateParams(string? loggedUserId = null)
        {
            UpdateTime = DateTimeHelpers.Timestamp(DateTimeHelpers.Now()).ToString();
            UpdateUser = loggedUserId;
            return (T)this;
        }

        public T SetDeleteParams(string? loggedUserId = null)
        {
            UpdateTime = DateTimeHelpers.Timestamp(DateTimeHelpers.Now()).ToString();
            UpdateUser = loggedUserId;
            Status = Status.Deleted;
            return (T)this;
        }

        [Key]
        public string Id { get; set; } = string.Empty;
        public Status Status { get; set; }
        [Display(Name = "Create Time")]
        public string? CreateTime { get; set; }
        [Display(Name = "Create User")]
        public string? CreateUser { get; set; }
        [Display(Name = "Update Time")]
        public string? UpdateTime { get; set; }
        [Display(Name = "Update User")]
        public string? UpdateUser { get; set; }
    }

}
