using LocationAPI.Data;
using LocationAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LocationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountryController : ControllerBase
    {
        private readonly YourDbContext _context;

        public CountryController(YourDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Country>>> GetAllCountries()
        {
            return await _context.Countries.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Country>> AddCountry([FromBody] Country country)
        {
            if (country == null)
            {
                return BadRequest();
            }

            _context.Countries.Add(country);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllCountries), new { id = country.Id }, country);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCountry(int id, [FromBody] Country country)
        {
            if (country == null || id != country.Id)
            {
                return BadRequest();
            }

            var existingCountry = await _context.Countries.FindAsync(id);
            if (existingCountry == null)
            {
                return NotFound();
            }

            existingCountry.CountryName = country.CountryName;
            existingCountry.CountryCode = country.CountryCode;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCountry(int id)
        {
            var country = await _context.Countries.FindAsync(id);
            if (country == null)
            {
                return NotFound();
            }

            _context.Countries.Remove(country);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}







using LocationAPI.Data;
using LocationAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LocationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StateController : ControllerBase
    {
        private readonly YourDbContext _context;

        public StateController(YourDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<State>>> GetAllStates()
        {
            return await _context.States.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<State>> AddState([FromBody] State state)
        {
            if (state == null)
            {
                return BadRequest();
            }

            _context.States.Add(state);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllStates), new { id = state.Id }, state);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateState(int id, [FromBody] State state)
        {
            if (state == null || id != state.Id)
            {
                return BadRequest();
            }

            var existingState = await _context.States.FindAsync(id);
            if (existingState == null)
            {
                return NotFound();
            }

            existingState.CountryId = state.CountryId;
            existingState.StateName = state.StateName;
            existingState.StateCode = state.StateCode;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteState(int id)
        {
            var state = await _context.States.FindAsync(id);
            if (state == null)
            {
                return NotFound();
            }

            _context.States.Remove(state);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}






using LocationAPI.Data;
using LocationAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LocationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DistrictController : ControllerBase
    {
        private readonly YourDbContext _context;

        public DistrictController(YourDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<District>>> GetAllDistricts()
        {
            return await _context.Districts.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<District>> AddDistrict([FromBody] District district)
        {
            if (district == null)
            {
                return BadRequest();
            }

            _context.Districts.Add(district);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllDistricts), new { id = district.Id }, district);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDistrict(int id, [FromBody] District district)
        {
            if (district == null || id != district.Id)
            {
                return BadRequest();
            }

            var existingDistrict = await _context.Districts.FindAsync(id);
            if (existingDistrict == null)
            {
                return NotFound();
            }

            existingDistrict.CountryId = district.CountryId;
            existingDistrict.StateId = district.StateId;
            existingDistrict.DistrictName = district.DistrictName;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDistrict(int id)
        {
            var district = await _context.Districts.FindAsync(id);
            if (district == null)
            {
                return NotFound();
            }

            _context.Districts.Remove(district);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}






using LocationAPI.Data;
using LocationAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LocationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CityController : ControllerBase
    {
        private readonly YourDbContext _context;

        public CityController(YourDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<City>>> GetAllCities()
        {
            return await _context.Cities.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<City>> AddCity([FromBody] City city)
        {
            if (city == null)
            {
                return BadRequest();
            }

            _context.Cities.Add(city);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllCities), new { id = city.Id }, city);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCity(int id, [FromBody] City city)
        {
            if (city == null || id != city.Id)
            {
                return BadRequest();
            }

            var existingCity = await _context.Cities.FindAsync(id);
            if (existingCity == null)
            {
                return NotFound();
            }

            existingCity.CountryId = city.CountryId;
            existingCity.StateId = city.StateId;
            existingCity.DistrictId = city.DistrictId;
            existingCity.CityName = city.CityName;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCity(int id)
        {
            var city = await _context.Cities.FindAsync(id);
            if (city == null)
            {
                return NotFound();
            }

            _context.Cities.Remove(city);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}





using LocationAPI.Data;
using LocationAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LocationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FullAddressController : ControllerBase
    {
        private readonly YourDbContext _context;

        public FullAddressController(YourDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FullAddress>>> GetAllFullAddresses()
        {
            return await _context.FullAddresses.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<FullAddress>> AddFullAddress([FromBody] FullAddress fullAddress)
        {
            if (fullAddress == null)
            {
                return BadRequest();
            }

            _context.FullAddresses.Add(fullAddress);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllFullAddresses), new { id = fullAddress.Id }, fullAddress);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFullAddress(int id, [FromBody] FullAddress fullAddress)
        {
            if (fullAddress == null || id != fullAddress.Id)
            {
                return BadRequest();
            }

            var existingFullAddress = await _context.FullAddresses.FindAsync(id);
            if (existingFullAddress == null)
            {
                return NotFound();
            }

            existingFullAddress.CountryId = fullAddress.CountryId;
            existingFullAddress.StateId = fullAddress.StateId;
            existingFullAddress.DistrictId = fullAddress.DistrictId;
            existingFullAddress.CityId = fullAddress.CityId;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFullAddress(int id)
        {
            var fullAddress = await _context.FullAddresses.FindAsync(id);
            if (fullAddress == null)
            {
                return NotFound();
            }

            _context.FullAddresses.Remove(fullAddress);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}



//------------YourDbContext-----------

using LocationAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace LocationAPI.Data
{
    public class YourDbContext : DbContext
    {
        public YourDbContext(DbContextOptions<YourDbContext> options) : base(options)
        {
        }

        public DbSet<Country> Countries { get; set; }
        public DbSet<State> States { get; set; }
        public DbSet<District> Districts { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<FullAddress> FullAddresses { get; set; }
    }
}



//--------Models------
namespace LocationAPI.Models
{
    public class Country
    {
        public int Id { get; set; }
        public string CountryName { get; set; }
        public string CountryCode { get; set; }
    }

}


namespace LocationAPI.Models
{
    public class State
    {
        public int Id { get; set; }
        public int CountryId { get; set; }
        public string StateName { get; set; }
        public string StateCode { get; set; }
    }
}

namespace LocationAPI.Models
{
    public class District
    {
        public int Id { get; set; }
        public int CountryId { get; set; }
        public int StateId { get; set; }
        public string DistrictName { get; set; }
    }

}


namespace LocationAPI.Models
{
        public class City
        {
            public int Id { get; set; }
            public int CountryId { get; set; }
            public int StateId { get; set; }
            public int DistrictId { get; set; }
            public string CityName { get; set; }
        }
}


namespace LocationAPI.Models
{
        public class FullAddress
        {
            public int Id { get; set; }
            public int CountryId { get; set; }
            public int StateId { get; set; }
            public int DistrictId { get; set; }
            public int CityId { get; set; }
        }
}


//------AppSettings.json

{
    "Logging": {
      "LogLevel": {
        "Default": "Information",
        "Microsoft.AspNetCore": "Warning"
      }
    },
    "AllowedHosts": "*",
    "ConnectionStrings": {
      "DefaultConnection": "Server=DESKTOP-67CCRDB\\SQLEXPRESS01;Database=LocationDb;Trusted_Connection=True;TrustServerCertificate=True"
    },
  
    //"AllowedHosts": "*",
    //"ConnectionStrings": {
    //  "DefaultConnection": "Server=DESKTOP-67CCRDB\\SQLEXPRESS01;Database=LocationDb;User Id=Tajim;Password=tajim123;TrustServerCertificate=True;"
    //}
  
  }


//-------program.cs------

//using Microsoft.AspNetCore.Builder;
//using Microsoft.Extensions.DependencyInjection;

//var builder = WebApplication.CreateBuilder(args);

//// Add services to the container.
//builder.Services.AddControllers();

//// Add CORS policy
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowSpecificOrigin",
//        builder =>
//        {
//            builder.WithOrigins("http://localhost:5175/") // Your frontend URL
//                   .AllowAnyHeader()
//                   .AllowAnyMethod();
//        });
//});

//var app = builder.Build();

//// Use CORS policy
//app.UseCors("AllowSpecificOrigin");

//app.UseAuthorization();

//app.MapControllers();

//app.Run();





using LocationAPI.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<YourDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder =>
        {
            builder.WithOrigins("http://localhost:5175/") // Your frontend URL
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();



//properties//Launch

{
    "$schema": "http://json.schemastore.org/launchsettings.json",
    "iisSettings": {
      "windowsAuthentication": false,
      "anonymousAuthentication": true,
      "iisExpress": {
        "applicationUrl": "http://localhost:56625",
        "sslPort": 44342
      }
    },
    "profiles": {
      "http": {
        "commandName": "Project",
        "dotnetRunMessages": true,
        "launchBrowser": true,
        "launchUrl": "swagger",
        "applicationUrl": "http://localhost:5298",
        "environmentVariables": {
          "ASPNETCORE_ENVIRONMENT": "Development"
        }
      },
      "https": {
        "commandName": "Project",
        "dotnetRunMessages": true,
        "launchBrowser": true,
        "launchUrl": "swagger",
        "applicationUrl": "https://localhost:7025;http://localhost:5298",
        "environmentVariables": {
          "ASPNETCORE_ENVIRONMENT": "Development"
        }
      },
      "IIS Express": {
        "commandName": "IISExpress",
        "launchBrowser": true,
        "launchUrl": "swagger",
        "environmentVariables": {
          "ASPNETCORE_ENVIRONMENT": "Development"
        }
      }
    }
  }

  //------All SQL------

  -- Drop tables if they exist
DROP TABLE IF EXISTS FullAddresses;
DROP TABLE IF EXISTS Cities;
DROP TABLE IF EXISTS Districts;
DROP TABLE IF EXISTS States;
DROP TABLE IF EXISTS Countries;

-- Create Countries Table
CREATE TABLE Countries (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CountryName NVARCHAR(100) NOT NULL,
    CountryCode NVARCHAR(10) NOT NULL
);

-- Create States Table
CREATE TABLE States (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CountryId INT NOT NULL,
    StateName NVARCHAR(100) NOT NULL,
    StateCode NVARCHAR(10) NOT NULL,
    FOREIGN KEY (CountryId) REFERENCES Countries(Id) ON DELETE NO ACTION
);

-- Create Districts Table
CREATE TABLE Districts (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CountryId INT NOT NULL,
    StateId INT NOT NULL,
    DistrictName NVARCHAR(100) NOT NULL,
    FOREIGN KEY (CountryId) REFERENCES Countries(Id) ON DELETE NO ACTION,
    FOREIGN KEY (StateId) REFERENCES States(Id) ON DELETE NO ACTION
);

-- Create Cities Table
CREATE TABLE Cities (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CountryId INT NOT NULL,
    StateId INT NOT NULL,
    DistrictId INT NOT NULL,
    CityName NVARCHAR(100) NOT NULL,
    FOREIGN KEY (CountryId) REFERENCES Countries(Id) ON DELETE NO ACTION,
    FOREIGN KEY (StateId) REFERENCES States(Id) ON DELETE NO ACTION,
    FOREIGN KEY (DistrictId) REFERENCES Districts(Id) ON DELETE NO ACTION
);

-- Create FullAddresses Table
CREATE TABLE FullAddresses (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CountryId INT NOT NULL,
    StateId INT NOT NULL,
    DistrictId INT NOT NULL,
    CityId INT NOT NULL,
    FOREIGN KEY (CountryId) REFERENCES Countries(Id) ON DELETE NO ACTION,
    FOREIGN KEY (StateId) REFERENCES States(Id) ON DELETE NO ACTION,
    FOREIGN KEY (DistrictId) REFERENCES Districts(Id) ON DELETE NO ACTION,
    FOREIGN KEY (CityId) REFERENCES Cities(Id) ON DELETE NO ACTION
);




SELECT 
    Id AS CountryId, 
    CountryName, 
    CountryCode 
FROM 
    Countries;

SELECT 
    s.Id AS StateId, 
    c.CountryName, 
    s.StateName, 
    s.StateCode 
FROM 
    States s
JOIN 
    Countries c ON s.CountryId = c.Id;



	SELECT 
    d.Id AS DistrictId, 
    c.CountryName, 
    s.StateName, 
    d.DistrictName 
FROM 
    Districts d
JOIN 
    States s ON d.StateId = s.Id
JOIN 
    Countries c ON d.CountryId = c.Id;



	SELECT 
    ci.Id AS CityId, 
    c.CountryName, 
    s.StateName, 
    d.DistrictName, 
    ci.CityName 
FROM 
    Cities ci
JOIN 
    Districts d ON ci.DistrictId = d.Id
JOIN 
    States s ON ci.StateId = s.Id
JOIN 
    Countries c ON ci.CountryId = c.Id;



	SELECT 
    fa.Id AS FullAddressId, 
    c.CountryName, 
    s.StateName, 
    d.DistrictName, 
    ci.CityName 
FROM 
    FullAddresses fa
JOIN 
    Cities ci ON fa.CityId = ci.Id
JOIN 
    Districts d ON ci.DistrictId = d.Id
JOIN 
    States s ON ci.StateId = s.Id
JOIN 
    Countries c ON ci.CountryId = c.Id;

  



    

create a task techonology use for Backend dotnet core 6.0.0 web api and for database sql server and for frontend use react Js
the task is let me tell you step by step what you have to do and how should be work this on UI for user

(a) on UI user will show five links country, state, district, city and fullAddress,
(b) whenwver user click on country link so user will fill countryName and countryCode and click on submit button so that form data should be store on countryTable and on countryTable should have a functionality edit and delete, so whenwver user clik on edit button on table so all user data should be go on country form for edit and user can edit,
(c) whenwver user click on state link so first user select country in drop down ans these countryes are geting from country form, then user fill stateName and stateCode and click on submit button so after submit that data should be store on stateTable and on stateTable and also should have a functionality edit and delete, so whenwver user clik on edit button on table so all user data should be go on State form for edit and user can edit,
(d) then whenwver user click on District link so first user select country in drop down then select state in drop down (Note:- if user click india so in states drop down indias states should be show, fi user select America so in states drop down Americas state should be show) then user fill district and then click on submit button and after submit that data should be go on districtTable and should have a functionality edit and delete, so whenwver user clik on edit button on table so all user data should be go on district form for edit and user can edit,
(e) then whenwver user click on city link so first user select country in drop down then select state in drop down then user select district in drop down (Note:- Whatever country the user has selected in the drop down, the states of that country should be visible in the state drop down and whatever state the user has selected, the districts of that state should be visible in the district drop-down) then fill City and click on submit button and after submit that data should be go on CityTable and should have a functionality edit and delete, so whenwver user clik on edit button on table so all user data should be go on City form for edit and user can edit,
(f) then whenwver user click on fullAddress link so first user select country in droup down then select state in drop down then select district in drop down then select city in drop down (Note:- Whatever country the user has selected in the drop down, the states of that country should be visible in the state drop down and whatever state the user has selected, the districts of that state should be visible in the district top-down and whatever district the user has selected, the cities of that district should be visible in the city drop down and should not show duplicate Country, State, District and City in any drop down should not show Duplicate data) then click on submit button after submit that data should be go on FullAddressTable and should have a functionality edit and delete, so whenwver user clik on edit button on table so all user data should be go on fullAddress form for edit and user can edit,

how should database tabes
(a) Countrys Table, (TH):- Id, Countrys, Countrys Code,
(b) States Table (TH):- Id, Countrys, States, States Code,
(c) District Table (Th):- Id, Countrys, States, Districts,
(D) City Table (TH):- Id, Countrys, States, Districts, Cityes,
(E) FullAddress Table (TH) Id, Cityes, Districts, States, Countrys,
