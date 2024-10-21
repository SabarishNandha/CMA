using CMA.Model;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace CMA.DAL
{
    public class ContactRepository : IContactRepository
    {
        private readonly string _filePath = "contacts.json";
        readonly IConfiguration Configuration;
        private readonly AppConfig _appConfig;
        public ContactRepository(IConfiguration setting, AppConfig appConfig)
        {
            Configuration = setting;
            _appConfig = appConfig;

        }
        public (IEnumerable<ContactDto> contacts, int count) GetAllContacts(int page, int pageSize)
        {
            var contacts = ReadContactsFromFile();

            // Paginate the results
            var result = contacts.Skip((page - 1) * pageSize).Take(pageSize);
            return (result, contacts.Count);
            
        }

        public ContactDto GetContactById(int id)
        {
            var contacts = ReadContactsFromFile();
            // Find the contact with the specified ContactId
            return contacts.FirstOrDefault(c => c.ContactId == id);
        }

        public void AddContact(ContactDto contact)
        {
            var contacts = ReadContactsFromFile();
            // Auto-increment the ContactId
            contact.ContactId = contacts.Max(c => c.ContactId) + 1;

            // Add the new contact to the list
            contacts.Add(contact);
            WriteContactsToFile(contacts);
        }

        public ContactDto UpdateContact(ContactDto updatedContact)
        {
            var contacts = ReadContactsFromFile();

            // Find the contact by ID
            var contact = contacts.FirstOrDefault(c => c.ContactId == updatedContact.ContactId);
            if (contact != null)
            {
                // Update the contact details
                contact.FirstName = updatedContact.FirstName;
                contact.LastName = updatedContact.LastName;
                WriteContactsToFile(contacts);
            }
            return contact;
        }

        public ContactDto DeleteContact(int id)
        {
            var contacts = ReadContactsFromFile();

            // Find the contact by ID
            var contactToRemove = contacts.FirstOrDefault(c => c.ContactId == id);
            if (contactToRemove != null)
            {
                contacts.Remove(contactToRemove);
                WriteContactsToFile(contacts);
            }

            return contactToRemove;
        }

        private List<ContactDto> ReadContactsFromFile()
        {
            if (File.Exists(_filePath))
            {
                // Read existing contacts from the JSON file
                var jsonData = File.ReadAllText(_filePath);
                return JsonSerializer.Deserialize<List<ContactDto>>(jsonData) ?? new List<ContactDto>();
            }
            return new List<ContactDto>();
        }

        private void WriteContactsToFile(List<ContactDto> contacts)
        {
            // Read existing contacts from the JSON file
            var jsonData = JsonSerializer.Serialize(contacts, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_filePath, jsonData);
        }

         
        public (string, DateTime, List<Claim>) GenerateJwtToken(string emailId)
        {
            var securityKey = Configuration["G9-JWT:SecretKey"];
            var mySecurityKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(Encoding.ASCII.GetBytes(securityKey));

            var credentials = new SigningCredentials(mySecurityKey, SecurityAlgorithms.HmacSha256);

            var tokenIssuer = Configuration["G9-JWT:Issuer"];
            var tokenAudience = Configuration["G9-JWT:Audience"];

            var claims = new List<Claim>
                    {

                        new Claim(ClaimTypes.Email, emailId)

                    };

            DateTime expiry = DateTime.UtcNow.AddMinutes(_appConfig.Expiry);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: expiry,
                issuer: tokenIssuer,
                audience: tokenAudience,
                signingCredentials: credentials);

            return (new JwtSecurityTokenHandler().WriteToken(token), expiry, claims);
        } 
    }
}
