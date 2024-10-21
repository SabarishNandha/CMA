using CMA.Model;
using System.Security.Claims;

namespace CMA.DAL
{
    public interface IContactRepository
    {
        (IEnumerable<ContactDto> contacts, int count) GetAllContacts(int page, int pageSize);
        ContactDto GetContactById(int id);
        void AddContact(ContactDto contact);
        ContactDto UpdateContact(ContactDto updatedContact);
        ContactDto DeleteContact(int id);
        (string, DateTime, List<Claim>) GenerateJwtToken(string emailId);
    }
}
