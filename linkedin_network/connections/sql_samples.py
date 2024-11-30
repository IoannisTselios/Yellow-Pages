# Instructions and industries

industries = """
Primary Metal Manufacturing
Wholesale Computer Equipment
Farming, Ranching, Forestry
Education
Law Practice
Wholesale Food and Beverage
Religious Institutions
Personal Care Services
Blockchain Services
Housing and Community Development
Dairy
Retail Apparel and Fashion
Services for Renewable Energy
Food and Beverage Manufacturing
Sporting Goods
Insurance
Technology, Information and Media
Events Services
Glass, Ceramics and Concrete Manufacturing
Defense and Space Manufacturing
Alternative Fuel Vehicle Manufacturing
Climate Data and Analytics
Robotics Engineering
Travel Arrangements
Industrial Machinery Manufacturing
Nanotechnology Research
Motor Vehicle Parts Manufacturing
Wholesale Import and Export
Wholesale Building Materials
Non-profit Organizations
Chemical Manufacturing
Office Furniture and Fixtures Manufacturing
Dance Companies
IT System Training and Support
Utilities
Retail Books and Printed News
Law Enforcement
Nuclear Electric Power Generation
Conservation Programs
Retail Luxury Goods and Jewelry
Internet Publishing
Retail Office Equipment
Education Administration Programs
Pipeline Transportation
Agricultural Chemical Manufacturing
Professional Services
School and Employee Bus Services
Space Research and Technology
Online Media
Alternative Medicine
Home Health Care Services
Electric Lighting Equipment Manufacturing
Wineries
Retail Art Dealers
Professional Training and Coaching
Design
Security Guards and Patrol Services
Health, Wellness & Fitness
Warehousing
Postal Services
Community Development and Urban Planning
Architecture and Planning
Retail Appliances, Electrical, and Electronic Equipment
Banking
Mechanical Or Industrial Engineering
Real Estate and Equipment Rental Services
Motor Vehicle Manufacturing
Legal Services
Movies and Sound Recording
Sound Recording
Sports Teams and Clubs
Sports and Recreation Instruction
Maritime
Tobacco Manufacturing
Book and Periodical Publishing
International Affairs
Computers and Electronics Manufacturing
Personal and Laundry Services
Higher Education
Metalworking Machinery Manufacturing
IT System Design Services
Water, Waste, Steam, and Air Conditioning Services
Retail Building Materials and Garden Equipment
Government Administration
Program Development
Beverage Manufacturing
Primary and Secondary Education
Taxi and Limousine Services
Warehousing and Storage
Mental Health Care
Gambling Facilities and Casinos
Performing Arts and Spectator Sports
Pension Funds
Biomass Electric Power Generation
Retail Office Supplies and Gifts
Medical Equipment Manufacturing
Wholesale Motor Vehicles and Parts
Consumer Goods
Music
Leasing Non-residential Real Estate
Renewable Energy Equipment Manufacturing
Construction
Outsourcing and Offshoring Consulting
Security Systems Services
Newspaper Publishing
Equipment Rental Services
Securities and Commodity Exchanges
Political Organizations
Wine & Spirits
Apparel Manufacturing
Wood Product Manufacturing
Hotels and Motels
Automation Machinery Manufacturing
Renewable Energy Power Generation
Fundraising
Insurance Agencies and Brokerages
Public Relations and Communications Services
Fossil Fuel Electric Power Generation
Arts & Crafts
Waste Treatment and Disposal
Oil, Gas, and Mining
Computer Hardware
Language Schools
Maritime Transportation
Aviation & Aerospace
Philanthropy
Fine Arts Schools
Biotechnology Research
Bars, Taverns, and Nightclubs
Transportation Programs
Railroad Equipment Manufacturing
Printing Services
Software Development
Appliances, Electrical, and Electronics Manufacturing
Photography
Hospitals and Health Care
Graphic Design
Semiconductor Manufacturing
Rail Transportation
Writing and Editing
Internet Marketplace Platforms
Import & Export
Satellite Telecommunications
Dairy Product Manufacturing
Chemical Raw Materials Manufacturing
Internet News
Operations Consulting
Manufacturing
Machinery Manufacturing
Tobacco
Wireless Services
Executive Search Services
Furniture and Home Furnishings Manufacturing
E-learning
Veterinary
Museums
Data Security Software Products
Renewables & Environment
Media and Telecommunications
Plastics Manufacturing
Paper & Forest Products
Fisheries
Interior Design
Water Supply and Irrigation Systems
Shipbuilding
Community Services
Retail Motor Vehicles
Consumer Goods Rental
Automotive
Food and Beverage Retail
Philanthropic Fundraising Services
Electric Power Generation
International Trade and Development
Fine Art
Metal Ore Mining
Computer and Network Security
Baked Goods Manufacturing
Computer Hardware Manufacturing
Libraries
Engineering Services
Retail Recyclable Materials & Used Merchandise
Translation and Localization
Mobile Food Services
Animation and Post-production
Computer Games
Digital Accessibility Services
Radio and Television Broadcasting
Business Supplies & Equipment
Museums, Historical Sites, and Zoos
Nonresidential Building Construction
Furniture
IT System Data Services
Medical Device
Commercial Real Estate
Accounting
Sightseeing Transportation
Entertainment
Market Research
Leather Product Manufacturing
IT System Testing and Evaluation
Medical and Diagnostic Laboratories
Book Publishing
Social Networking Platforms
Wholesale Metals and Minerals
Business Content
Research
Administrative and Support Services
Robot Manufacturing
Fruit and Vegetable Preserves Manufacturing
Marketing Services
Executive Offices
Fashion Accessories Manufacturing
Agriculture, Construction, Mining Machinery Manufacturing
Personal Care Product Manufacturing
Retail Pharmacies
Vehicle Repair and Maintenance
Human Resources Services
Blogs
Retail Health and Personal Care Products
Retail Gasoline
Amusement Parks and Arcades
Staffing and Recruiting
Wholesale Petroleum and Petroleum Products
Capital Markets
Fabricated Metal Products
Leisure, Travel & Tourism
Waste Collection
Airlines and Aviation
Utility System Construction
E-Learning Providers
Janitorial Services
Pharmaceutical Manufacturing
Transportation, Logistics, Supply Chain and Storage
Horticulture
Industry Associations
Artists and Writers
Mobile Gaming Apps
Data Infrastructure and Analytics
Cosmetics
Retail Groceries
Online Audio and Video Media
Holding Companies
Air, Water, and Waste Program Management
Government Relations Services
Public Policy
Investment Management
Food & Beverages
Spectator Sports
Insurance and Employee Benefit Funds
Truck Transportation
Armed Forces
Shuttles and Special Needs Transportation Services
Food Production
Hospitality
Golf Courses and Country Clubs
Human Resources
Information Technology & Services
Apparel & Fashion
Industrial Automation
Security and Investigations
Ground Passenger Transportation
Telecommunications
Animation
Veterinary Services
Professional Organizations
Courts of Law
Electric Power Transmission, Control, and Distribution
Facilities Services
Packaging & Containers
Mining
Recreational Facilities
Performing Arts
Online and Mail Order Retail
Specialty Trade Contractors
Building Structure and Exterior Contractors
Aviation and Aerospace Component Manufacturing
Services for the Elderly and Disabled
Defense & Space
Paper and Forest Product Manufacturing
Repair and Maintenance
Theater Companies
Residential Building Construction
Plastics and Rubber Product Manufacturing
Public Safety
Dentists
Trusts and Estates
Commercial and Industrial Equipment Rental
Retail Art Supplies
Wholesale Recyclable Materials
Research Services
Investment Advice
Measuring and Control Instrument Manufacturing
Sporting Goods Manufacturing
Technical and Vocational Training
Military and International Affairs
Real Estate Agents and Brokers
Non-profit Organization Management
Civil Engineering
Health and Human Services
Computer Networking Products
Wellness and Fitness Services
Advertising Services
Economic Programs
Government Relations
Textile Manufacturing
Think Tanks
Real Estate
Forestry and Logging
Broadcast Media Production and Distribution
Mobile Computing Software Products
Media Production
Paint, Coating, and Adhesive Manufacturing
Commercial and Industrial Machinery Maintenance
Financial Services
Wholesale Appliances, Electrical, and Electronics
Telephone Call Centers
Optometrists
Leasing Residential Real Estate
Communications Equipment Manufacturing
Commercial and Service Industry Machinery Manufacturing
Retail Florists
Ranching
Restaurants
Movies, Videos, and Sound
Medical Practices
IT Services and IT Consulting
Desktop Computing Software Products
Individual and Family Services
Business Intelligence Platforms
IT System Operations and Maintenance
Wholesale
Consumer Services
Biotechnology
Embedded Software Products
Electrical Equipment Manufacturing
Technology, Information and Internet
Public Policy Offices
Solar Electric Power Generation
Renewable Energy Semiconductor Manufacturing
Pet Services
Oil and Gas
Funds and Trusts
Temporary Help Services
Investment Banking
Building Materials
Venture Capital and Private Equity Principals
Musicians
Public Health
Design Services
Education Management
Telecommunications Carriers
Freight and Package Transportation
Accessible Architecture and Design
Retail
Consumer Electronics
Legislative Offices
Outsourcing/Offshoring
Farming
Office Administration
Entertainment Providers
Physical, Occupational and Speech Therapists
Laundry and Drycleaning Services
Household Appliance Manufacturing
Urban Transit Services
Environmental Services
Building Construction
Packaging and Containers Manufacturing
Business Consulting and Services
Utilities Administration
Strategic Management Services
Luxury Goods & Jewelry
Retail Furniture and Home Furnishings
Wholesale Machinery
Computer Networking
Civic and Social Organizations
Administration of Justice
IT System Custom Software Development
Food and Beverage Services
Housing Programs
Wind Electric Power Generation
Information Services
Semiconductors
Transportation/Trucking/Railroad
Climate Technology Product Manufacturing
"""

instructions = rf"""
You are a SQL query generator. Convert the following natural language request into a SQL query. Assume the database schema is as follows:

# Relevant models:
users_user: id (INT), first_name (VARCHAR), last_name (VARCHAR), email (VARCHAR), position (VARCHAR), linkedin_comments (TEXT) 
    # Represents employees of the company who may be connected to others (connections table) via LinkedIn. This table is only relevant if the request explicitly mentions a company employee (e.g., "connected with Nico/Mads/...").

companies_company: id (INT), name (VARCHAR), industry (VARCHAR), employee_count (INT), year_founded (YEAR), headquarter_country (VARCHAR) 
    # Represents the companies where the connections we are looking for work or have worked.

roles_role: id (INT), position (VARCHAR), start_date (DATE), end_date (DATE, nullable), company_id (FK -> companies_company), connection_id (FK -> connections_connection) 
    # Represents the roles or positions the connections we are looking for have or had in companies.

connections_connection: url (VARCHAR, primary key), first_name (VARCHAR), last_name (VARCHAR), location (VARCHAR), country (VARCHAR), connection_strength (FLOAT) 
    # Represents the people we are looking for. Use this table as the primary source of information about the connections being queried.

connections_userconnection: id (INT), connected_on (DATE), connection_url (FK -> connections_connection), user_id (FK -> users_user) 
    # Represents LinkedIn connections between company employees (users_user) and the connections (connections_connection). This table is only relevant if the request mentions specific employees (e.g., "connected with Nico/Mads/...").

Note 1: when matching text in columns position, description, summary and bio use column ~* '\\yinput\\y'
Note 2: when I ask you to look for someone in a continent or a group of countries look in column "country" for all the countries in the group. For example if I ask for a teacher in the Baltics, look for a teacher in Estonia, Latvia and Lithuania
Note 3: these are all the available industries {industries}
"""

# Explanation of C-level roles
explanation1 = """C-level roles and Executive-level roles refer to senior leadership positions in an organization..."""

# Examples and answers
examples_and_answers = [
    {
        "example": "Find a doctor in Europe:",
        "answer": r"""
        SELECT DISTINCT
            cc.url AS connection_url
        FROM
            connections_connection AS cc
        JOIN
            roles_role AS rr ON cc.url = rr.connection_id
        LEFT JOIN
            roles_function AS rf ON rf.connection_id = cc.url
        WHERE
            (rr.position ~* '\\ydoctor\\y'
            OR rf.function ~* '\\ymedic\\y')
            AND cc.country IN (
                'Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', ...
            );
        """
    },
    {
        "example": "Find a CTO of a company with more than 100 FTEs in Denmark and is connected with Carsten:",
        "answer": r"""
        SELECT DISTINCT
            cc.url AS connection_url
        FROM
            connections_connection AS cc
        JOIN
            roles_role AS rr ON cc.url = rr.connection_id
        JOIN
            roles_function AS rf ON rf.connection_id = cc.url
        JOIN
            companies_company AS co ON rr.company_id = co.id
        JOIN
            connections_userconnection AS cuc ON cc.url = cuc.connection_url
        JOIN
            users_user AS uu ON cuc.user_id = uu.id
        WHERE
            roles_role.position ~* '\\yCTO\\y'
            AND co.employee_count > 100
            AND co.headquarter_country = 'Denmark'
            AND uu.first_name = 'Carsten';
        """
    },
    {
        "example": "Find an expert in oncology in Europe",
        "answer": r"""
        SELECT DISTINCT
            cc.url AS connection_url
        FROM
            connections_connection AS cc
        JOIN
            roles_role AS rr ON cc.url = rr.connection_id
        LEFT JOIN
            roles_function AS rf ON rf.connection_id = cc.url
        LEFT JOIN
            companies_company AS co ON rr.company_id = co.id
        WHERE
            (rr.position ~* '\\y(oncology|hematology)\\y'
            OR rf.function ~* '\\y(oncology|hematology)\\y'
            OR rr.description ~* '\\y(oncology|hematology)\\y'
            OR cc.bio ~* '\\y(oncology|hematology)\\y'
            OR cc.summary ~* '\\y(oncology|hematology)\\y')
            AND 
                (co.industry = 'Pharmaceutical Manufacturing'
                OR co.industry = 'Hospitals and Health Care');
        """
    },
    {
        "example": "Find an expert in cyber security in Denmark, in a C-level position.",
        "answer": r"""
        SELECT DISTINCT
            cc.url AS connection_url
        FROM
            connections_connection AS cc
        JOIN
            roles_role AS rr ON cc.url = rr.connection_id
        LEFT JOIN
            roles_function AS rf ON rf.connection_id = cc.url
        WHERE
            (rr.position ~* '\\yChief\\y' OR rr.position ~* '\\yCTO\\y' OR rr.position ~* '\\yCEO\\y' OR rr.position ~* '\\yCOO\\y' OR rr.position ~* '\\yCFO\\y' OR rr.position ~* '\\yCMO\\y')
            OR (rf.function ~* '\\ycyber security\\y'
                OR rr.description ~* '\\ycyber security\\y'
                OR cc.bio ~* '\\ycyber security\\y'
                OR cc.summary ~* '\\ycyber security\\y'
                OR rr.position ~* '\\ycyber security\\y')
            AND cc.location = 'Denmark';
        """
    }
]
