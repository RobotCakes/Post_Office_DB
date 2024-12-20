/****** Object:  Database [group10]    Script Date: 11/19/2024 4:03:57 PM ******/
CREATE DATABASE [group10]  (EDITION = 'Basic', SERVICE_OBJECTIVE = 'Basic', MAXSIZE = 2 GB) WITH CATALOG_COLLATION = SQL_Latin1_General_CP1_CI_AS, LEDGER = OFF;
GO
ALTER DATABASE [group10] SET COMPATIBILITY_LEVEL = 160
GO
ALTER DATABASE [group10] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [group10] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [group10] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [group10] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [group10] SET ARITHABORT OFF 
GO
ALTER DATABASE [group10] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [group10] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [group10] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [group10] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [group10] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [group10] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [group10] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [group10] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [group10] SET ALLOW_SNAPSHOT_ISOLATION ON 
GO
ALTER DATABASE [group10] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [group10] SET READ_COMMITTED_SNAPSHOT ON 
GO
ALTER DATABASE [group10] SET  MULTI_USER 
GO
ALTER DATABASE [group10] SET ENCRYPTION ON
GO
ALTER DATABASE [group10] SET QUERY_STORE = ON
GO
ALTER DATABASE [group10] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 100, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
/*** The scripts of database scoped configurations in Azure should be executed inside the target database connection. ***/
GO
-- ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 8;
GO
/****** Object:  User [syed]    Script Date: 11/19/2024 4:03:58 PM ******/
CREATE USER [syed] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  User [daniel]    Script Date: 11/19/2024 4:03:58 PM ******/
CREATE USER [daniel] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  User [ashley]    Script Date: 11/19/2024 4:03:58 PM ******/
CREATE USER [ashley] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  User [alejandro]    Script Date: 11/19/2024 4:03:58 PM ******/
CREATE USER [alejandro] WITH DEFAULT_SCHEMA=[dbo]
GO
sys.sp_addrolemember @rolename = N'db_owner', @membername = N'syed'
GO
sys.sp_addrolemember @rolename = N'db_owner', @membername = N'daniel'
GO
sys.sp_addrolemember @rolename = N'db_owner', @membername = N'ashley'
GO
sys.sp_addrolemember @rolename = N'db_owner', @membername = N'alejandro'
GO
/****** Object:  Schema [addresses]    Script Date: 11/19/2024 4:03:58 PM ******/
CREATE SCHEMA [addresses]
GO
/****** Object:  Schema [admin]    Script Date: 11/19/2024 4:03:58 PM ******/
CREATE SCHEMA [admin]
GO
/****** Object:  Schema [audit]    Script Date: 11/19/2024 4:03:58 PM ******/
CREATE SCHEMA [audit]
GO
/****** Object:  Schema [auditlog]    Script Date: 11/19/2024 4:03:58 PM ******/
CREATE SCHEMA [auditlog]
GO
/****** Object:  Schema [business]    Script Date: 11/19/2024 4:03:58 PM ******/
CREATE SCHEMA [business]
GO
/****** Object:  Schema [names]    Script Date: 11/19/2024 4:03:58 PM ******/
CREATE SCHEMA [names]
GO
/****** Object:  Table [dbo].[office]    Script Date: 11/19/2024 4:03:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[office](
	[name] [varchar](50) NULL,
	[managerStartDate] [datetime] NULL,
	[numEmployees] [int] NULL,
	[createdAt] [datetime] NOT NULL,
	[createdBy] [int] NULL,
	[updatedAt] [datetime] NOT NULL,
	[updatedBy] [int] NULL,
	[managerName] [int] NULL,
	[officeAddress] [int] NULL,
	[OID] [tinyint] NOT NULL,
	[isDeleted] [bit] NULL,
 CONSTRAINT [PK_office_OID] PRIMARY KEY CLUSTERED 
(
	[OID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[package]    Script Date: 11/19/2024 4:03:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[package](
	[PID] [int] IDENTITY(1,1) NOT NULL,
	[trackingNumber] [int] NULL,
	[packageContent] [varchar](255) NULL,
	[packageLength] [float] NULL,
	[packageWidth] [float] NULL,
	[packageHeight] [float] NULL,
	[weight] [float] NOT NULL,
	[deliverPrice] [float] NOT NULL,
	[isDelivery] [bit] NOT NULL,
	[deliveryPriority] [int] NOT NULL,
	[specialInstructions] [varchar](100) NULL,
	[isFragile] [bit] NOT NULL,
	[isDeleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[PID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[statuses]    Script Date: 11/19/2024 4:03:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[statuses](
	[SID] [int] IDENTITY(1,1) NOT NULL,
	[state] [varchar](100) NULL,
	[updatedBy] [int] NOT NULL,
	[notes] [varchar](255) NULL,
	[timeOfStatus] [datetime] NULL,
	[currOID] [tinyint] NULL,
	[PID] [int] NOT NULL,
	[nextOID] [tinyint] NULL,
	[userTypeUpdate] [varchar](10) NOT NULL,
	[trackingNumber] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[SID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[trackinginfo]    Script Date: 11/19/2024 4:03:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[trackinginfo](
	[senderName] [int] NULL,
	[senderAddress] [int] NULL,
	[receiverName] [int] NULL,
	[receiverAddress] [int] NULL,
	[receiverUID] [int] NULL,
	[senderUID] [int] NULL,
	[currentStatus] [int] NULL,
	[trackingNumber] [int] IDENTITY(1,1) NOT NULL,
	[expectedDelivery] [datetime] NOT NULL,
 CONSTRAINT [PK_trackingInfo_number] PRIMARY KEY CLUSTERED 
(
	[trackingNumber] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[EmployeePackageTrackingInfo]    Script Date: 11/19/2024 4:03:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[EmployeePackageTrackingInfo] AS
SELECT 
    ti.trackingNumber,
    p.packageContent,
    DATEDIFF(MINUTE, s.timeOfStatus, GETDATE()) AS time_within_office, -- Time in minutes
    p.deliveryPriority
FROM 
    trackinginfo ti
JOIN 
    package p ON ti.trackingNumber = p.trackingNumber
JOIN 
    statuses s ON ti.currentStatus = s.SID
JOIN 
    office o ON s.currOID = o.OID;
GO
/****** Object:  Table [dbo].[business]    Script Date: 11/19/2024 4:03:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[business](
	[UID] [int] IDENTITY(1,1) NOT NULL,
	[businessName] [varchar](50) NULL,
	[ownerName] [int] NULL,
	[warehouseAddress] [int] NULL,
	[username] [varchar](20) NOT NULL,
	[password] [varchar](20) NOT NULL,
	[email] [varchar](30) NULL,
	[createdAt] [datetime] NOT NULL,
	[updatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[username] ASC,
	[UID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[UID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[customer]    Script Date: 11/19/2024 4:03:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[customer](
	[UID] [int] IDENTITY(1,1) NOT NULL,
	[name] [int] NULL,
	[address] [int] NULL,
	[username] [varchar](20) NOT NULL,
	[password] [varchar](20) NOT NULL,
	[phoneNumber] [varchar](20) NULL,
	[email] [varchar](30) NULL,
	[createdAt] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[username] ASC,
	[UID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[UID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[CustomerPackageTracking]    Script Date: 11/19/2024 4:03:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[CustomerPackageTracking] AS
SELECT 
    ti.trackingNumber AS Tracking_Number, 
    p.packageContent AS Content, 
    o.name AS Current_Office,
    DATEADD(day, 7, MIN(s.timeOfStatus)) AS ExpectedDeliverDate
FROM 
    trackinginfo ti
JOIN 
    package p ON ti.trackingNumber = p.trackingNumber
JOIN 
    statuses s ON ti.currentStatus = s.SID
JOIN 
    office o ON s.currOID = o.OID
JOIN 
    customer c ON ti.senderUID = c.UID -- assuming customer table exists
LEFT JOIN 
    business b ON ti.senderUID = b.UID -- assuming businesses table exists
WHERE 
    c.UID IS NOT NULL OR b.UID IS NOT NULL -- ensures either customer or business UID is used
GROUP BY 
    ti.trackingNumber, 
    p.packageContent, 
    o.name
GO
/****** Object:  View [dbo].[AdminPackageTracking]    Script Date: 11/19/2024 4:03:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[AdminPackageTracking] AS
SELECT 
    ti.trackingNumber AS Tracking_Number, 
    p.packageContent AS Content, 
    DATEDIFF(MINUTE, s.timeOfStatus, GETDATE()) AS time_within_office, 
    p.deliveryPriority AS Priority
FROM 
    trackinginfo ti
JOIN 
    package p ON ti.trackingNumber = p.trackingNumber
JOIN 
    statuses s ON ti.currentStatus = s.SID;
GO
/****** Object:  View [dbo].[officeView]    Script Date: 11/19/2024 4:03:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Create the 'office' view to reference the office table
CREATE VIEW [dbo].[officeView] AS
SELECT *
FROM dbo.office;
GO
/****** Object:  Table [dbo].[addresses]    Script Date: 11/19/2024 4:03:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[addresses](
	[addressID] [int] IDENTITY(1,1) NOT NULL,
	[streetAddress] [varchar](50) NULL,
	[city] [varchar](20) NULL,
	[state] [varchar](2) NULL,
	[zipcode] [int] NULL,
	[country] [varchar](56) NULL,
PRIMARY KEY CLUSTERED 
(
	[addressID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[admin]    Script Date: 11/19/2024 4:03:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[admin](
	[AID] [int] IDENTITY(1,1) NOT NULL,
	[adminName] [varchar](50) NOT NULL,
	[username] [varchar](20) NOT NULL,
	[password] [varchar](20) NOT NULL,
	[phoneNumber] [varchar](15) NULL,
	[email] [varchar](30) NULL,
	[adminCreatedAt] [datetime] NOT NULL,
	[adminLastUpdatedAt] [datetime] NULL,
	[lastUpdatedBy] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[username] ASC,
	[AID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[AID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[auditlog]    Script Date: 11/19/2024 4:03:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[auditlog](
	[auditID] [int] NOT NULL,
	[PID] [int] NOT NULL,
	[EID] [int] NOT NULL,
	[AID] [int] NOT NULL,
	[statusUpdate] [varchar](100) NOT NULL,
	[updatedAt] [datetime] NULL,
	[OID] [tinyint] NOT NULL,
 CONSTRAINT [PK_auditlog] PRIMARY KEY CLUSTERED 
(
	[auditID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[deliveryprio]    Script Date: 11/19/2024 4:03:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[deliveryprio](
	[deliveryPrio] [int] NOT NULL,
	[type] [varchar](20) NOT NULL,
	[price] [float] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[deliveryPrio] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[driver]    Script Date: 11/19/2024 4:03:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[driver](
	[EID] [int] NULL,
	[licensePlate] [varchar](8) NULL,
	[isDeleted] [bit] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[employee]    Script Date: 11/19/2024 4:03:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[employee](
	[EID] [int] IDENTITY(1,1) NOT NULL,
	[employeeName] [int] NULL,
	[username] [varchar](20) NOT NULL,
	[password] [varchar](20) NOT NULL,
	[isManager] [bit] NOT NULL,
	[phoneNumber] [varchar](15) NULL,
	[email] [varchar](30) NOT NULL,
	[employeeStartDate] [datetime] NULL,
	[employeeCreatedOn] [datetime] NULL,
	[employeeCreatedBy] [int] NULL,
	[userTypeCreate] [varchar](20) NOT NULL,
	[lastUpdatedAt] [datetime] NULL,
	[lastUpdatedBy] [int] NULL,
	[userTypeModify] [varchar](20) NULL,
	[OID] [tinyint] NULL,
	[isDeleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[username] ASC,
	[EID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[EID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[invoices]    Script Date: 11/19/2024 4:03:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[invoices](
	[invoiceID] [int] IDENTITY(1,1) NOT NULL,
	[paymentID] [int] NULL,
	[customerID] [int] NULL,
	[amountDue] [decimal](10, 2) NULL,
	[amountPaid] [decimal](10, 2) NULL,
	[Discount] [decimal](10, 2) NULL,
	[invoiceDate] [datetime] NULL,
	[dueDate] [datetime] NULL,
	[invStatus] [varchar](50) NULL,
	[createdAt] [datetime] NULL,
	[updatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[invoiceID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[names]    Script Date: 11/19/2024 4:03:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[names](
	[nameID] [int] IDENTITY(1,1) NOT NULL,
	[firstName] [varchar](20) NULL,
	[middleInitial] [varchar](1) NULL,
	[lastName] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[nameID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[payments]    Script Date: 11/19/2024 4:03:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[payments](
	[paymentID] [int] IDENTITY(1,1) NOT NULL,
	[packageID] [int] NULL,
	[amount] [decimal](10, 2) NULL,
	[createdAt] [datetime] NULL,
	[updatedAt] [datetime] NULL,
	[OID] [tinyint] NULL,
	[content] [varchar](250) NOT NULL,
 CONSTRAINT [PK__payments__9B556A58A2CECA2D] PRIMARY KEY CLUSTERED 
(
	[paymentID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[supplies]    Script Date: 11/19/2024 4:03:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[supplies](
	[name] [varchar](50) NOT NULL,
	[OID] [tinyint] NOT NULL,
	[quantity] [int] NULL,
	[pricePerUnit] [float] NULL,
	[dateadded] [datetime] NULL,
	[addedBy] [int] NULL,
	[lastupdatedAt] [datetime] NULL,
	[updatedBy] [int] NULL,
	[description] [varchar](50) NULL,
	[supplyID] [int] IDENTITY(1,1) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[supplyID] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[truck]    Script Date: 11/19/2024 4:03:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[truck](
	[licensePlate] [varchar](8) NOT NULL,
	[OID] [tinyint] NULL,
	[truckType] [varchar](30) NULL,
	[maxWeight] [float] NULL,
	[truckCreatedOn] [datetime] NOT NULL,
	[createdBy] [int] NOT NULL,
	[lastUpdatedAt] [datetime] NULL,
	[lastUpdatedBy] [int] NULL,
	[userTypeModify] [varchar](20) NULL,
	[currDriver] [int] NULL,
	[isDeleted] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[licensePlate] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[addresses] ADD  DEFAULT (NULL) FOR [streetAddress]
GO
ALTER TABLE [dbo].[addresses] ADD  DEFAULT (NULL) FOR [city]
GO
ALTER TABLE [dbo].[addresses] ADD  DEFAULT (NULL) FOR [state]
GO
ALTER TABLE [dbo].[addresses] ADD  DEFAULT (NULL) FOR [zipcode]
GO
ALTER TABLE [dbo].[addresses] ADD  DEFAULT (NULL) FOR [country]
GO
ALTER TABLE [dbo].[auditlog] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[business] ADD  DEFAULT (NULL) FOR [businessName]
GO
ALTER TABLE [dbo].[business] ADD  DEFAULT (NULL) FOR [ownerName]
GO
ALTER TABLE [dbo].[business] ADD  DEFAULT (NULL) FOR [warehouseAddress]
GO
ALTER TABLE [dbo].[business] ADD  DEFAULT (NULL) FOR [password]
GO
ALTER TABLE [dbo].[business] ADD  DEFAULT (NULL) FOR [email]
GO
ALTER TABLE [dbo].[business] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[business] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[customer] ADD  DEFAULT (NULL) FOR [name]
GO
ALTER TABLE [dbo].[customer] ADD  DEFAULT (NULL) FOR [address]
GO
ALTER TABLE [dbo].[customer] ADD  DEFAULT (NULL) FOR [password]
GO
ALTER TABLE [dbo].[customer] ADD  DEFAULT (NULL) FOR [phoneNumber]
GO
ALTER TABLE [dbo].[customer] ADD  DEFAULT (NULL) FOR [email]
GO
ALTER TABLE [dbo].[customer] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[employee] ADD  DEFAULT (NULL) FOR [employeeName]
GO
ALTER TABLE [dbo].[employee] ADD  DEFAULT (NULL) FOR [password]
GO
ALTER TABLE [dbo].[employee] ADD  DEFAULT (NULL) FOR [isManager]
GO
ALTER TABLE [dbo].[employee] ADD  DEFAULT (NULL) FOR [phoneNumber]
GO
ALTER TABLE [dbo].[employee] ADD  DEFAULT (NULL) FOR [email]
GO
ALTER TABLE [dbo].[employee] ADD  DEFAULT (getdate()) FOR [employeeStartDate]
GO
ALTER TABLE [dbo].[employee] ADD  DEFAULT (getdate()) FOR [employeeCreatedOn]
GO
ALTER TABLE [dbo].[employee] ADD  DEFAULT (NULL) FOR [employeeCreatedBy]
GO
ALTER TABLE [dbo].[employee] ADD  DEFAULT (getdate()) FOR [lastUpdatedAt]
GO
ALTER TABLE [dbo].[employee] ADD  DEFAULT (NULL) FOR [lastUpdatedBy]
GO
ALTER TABLE [dbo].[employee] ADD  DEFAULT ((0)) FOR [isDeleted]
GO
ALTER TABLE [dbo].[invoices] ADD  DEFAULT (getdate()) FOR [invoiceDate]
GO
ALTER TABLE [dbo].[invoices] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[invoices] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[names] ADD  DEFAULT (NULL) FOR [firstName]
GO
ALTER TABLE [dbo].[names] ADD  DEFAULT (NULL) FOR [middleInitial]
GO
ALTER TABLE [dbo].[names] ADD  DEFAULT (NULL) FOR [lastName]
GO
ALTER TABLE [dbo].[office] ADD  DEFAULT (NULL) FOR [name]
GO
ALTER TABLE [dbo].[office] ADD  DEFAULT (getdate()) FOR [managerStartDate]
GO
ALTER TABLE [dbo].[office] ADD  DEFAULT (NULL) FOR [numEmployees]
GO
ALTER TABLE [dbo].[office] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[office] ADD  DEFAULT (NULL) FOR [createdBy]
GO
ALTER TABLE [dbo].[office] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[office] ADD  DEFAULT (NULL) FOR [updatedBy]
GO
ALTER TABLE [dbo].[office] ADD  DEFAULT ((0)) FOR [isDeleted]
GO
ALTER TABLE [dbo].[package] ADD  DEFAULT (NULL) FOR [packageContent]
GO
ALTER TABLE [dbo].[package] ADD  DEFAULT (NULL) FOR [packageLength]
GO
ALTER TABLE [dbo].[package] ADD  DEFAULT (NULL) FOR [packageWidth]
GO
ALTER TABLE [dbo].[package] ADD  DEFAULT (NULL) FOR [packageHeight]
GO
ALTER TABLE [dbo].[package] ADD  DEFAULT ((1)) FOR [isDelivery]
GO
ALTER TABLE [dbo].[package] ADD  DEFAULT (NULL) FOR [specialInstructions]
GO
ALTER TABLE [dbo].[package] ADD  DEFAULT ((0)) FOR [isFragile]
GO
ALTER TABLE [dbo].[package] ADD  DEFAULT ((0)) FOR [isDeleted]
GO
ALTER TABLE [dbo].[payments] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[payments] ADD  DEFAULT (getdate()) FOR [updatedAt]
GO
ALTER TABLE [dbo].[statuses] ADD  DEFAULT (NULL) FOR [state]
GO
ALTER TABLE [dbo].[statuses] ADD  DEFAULT (NULL) FOR [updatedBy]
GO
ALTER TABLE [dbo].[statuses] ADD  DEFAULT (NULL) FOR [notes]
GO
ALTER TABLE [dbo].[statuses] ADD  DEFAULT (NULL) FOR [timeOfStatus]
GO
ALTER TABLE [dbo].[supplies] ADD  CONSTRAINT [df_dateadded]  DEFAULT (getdate()) FOR [dateadded]
GO
ALTER TABLE [dbo].[supplies] ADD  CONSTRAINT [df_lastupdatedAt]  DEFAULT (getdate()) FOR [lastupdatedAt]
GO
ALTER TABLE [dbo].[truck] ADD  DEFAULT ((0)) FOR [isDeleted]
GO
ALTER TABLE [dbo].[admin]  WITH CHECK ADD FOREIGN KEY([lastUpdatedBy])
REFERENCES [dbo].[admin] ([AID])
GO
ALTER TABLE [dbo].[auditlog]  WITH CHECK ADD  CONSTRAINT [FK_audit_OID] FOREIGN KEY([OID])
REFERENCES [dbo].[office] ([OID])
GO
ALTER TABLE [dbo].[auditlog] CHECK CONSTRAINT [FK_audit_OID]
GO
ALTER TABLE [dbo].[auditlog]  WITH CHECK ADD  CONSTRAINT [FK_auditLog_AID] FOREIGN KEY([AID])
REFERENCES [dbo].[admin] ([AID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[auditlog] CHECK CONSTRAINT [FK_auditLog_AID]
GO
ALTER TABLE [dbo].[auditlog]  WITH CHECK ADD  CONSTRAINT [FK_auditLog_EID] FOREIGN KEY([EID])
REFERENCES [dbo].[employee] ([EID])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[auditlog] CHECK CONSTRAINT [FK_auditLog_EID]
GO
ALTER TABLE [dbo].[auditlog]  WITH CHECK ADD  CONSTRAINT [FK_auditlog_packageID] FOREIGN KEY([PID])
REFERENCES [dbo].[package] ([PID])
GO
ALTER TABLE [dbo].[auditlog] CHECK CONSTRAINT [FK_auditlog_packageID]
GO
ALTER TABLE [dbo].[business]  WITH CHECK ADD FOREIGN KEY([ownerName])
REFERENCES [dbo].[names] ([nameID])
GO
ALTER TABLE [dbo].[business]  WITH CHECK ADD FOREIGN KEY([warehouseAddress])
REFERENCES [dbo].[addresses] ([addressID])
GO
ALTER TABLE [dbo].[customer]  WITH CHECK ADD FOREIGN KEY([address])
REFERENCES [dbo].[addresses] ([addressID])
GO
ALTER TABLE [dbo].[customer]  WITH CHECK ADD FOREIGN KEY([name])
REFERENCES [dbo].[names] ([nameID])
GO
ALTER TABLE [dbo].[driver]  WITH CHECK ADD FOREIGN KEY([EID])
REFERENCES [dbo].[employee] ([EID])
GO
ALTER TABLE [dbo].[driver]  WITH CHECK ADD FOREIGN KEY([licensePlate])
REFERENCES [dbo].[truck] ([licensePlate])
GO
ALTER TABLE [dbo].[employee]  WITH CHECK ADD  CONSTRAINT [FK_employee_name] FOREIGN KEY([employeeName])
REFERENCES [dbo].[names] ([nameID])
GO
ALTER TABLE [dbo].[employee] CHECK CONSTRAINT [FK_employee_name]
GO
ALTER TABLE [dbo].[employee]  WITH CHECK ADD  CONSTRAINT [FK_employee_OID] FOREIGN KEY([OID])
REFERENCES [dbo].[office] ([OID])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[employee] CHECK CONSTRAINT [FK_employee_OID]
GO
ALTER TABLE [dbo].[invoices]  WITH CHECK ADD  CONSTRAINT [FK_invoices_payment] FOREIGN KEY([paymentID])
REFERENCES [dbo].[payments] ([paymentID])
GO
ALTER TABLE [dbo].[invoices] CHECK CONSTRAINT [FK_invoices_payment]
GO
ALTER TABLE [dbo].[office]  WITH CHECK ADD  CONSTRAINT [FK_office_createdBy] FOREIGN KEY([createdBy])
REFERENCES [dbo].[admin] ([AID])
GO
ALTER TABLE [dbo].[office] CHECK CONSTRAINT [FK_office_createdBy]
GO
ALTER TABLE [dbo].[office]  WITH CHECK ADD  CONSTRAINT [FK_office_managerName] FOREIGN KEY([managerName])
REFERENCES [dbo].[names] ([nameID])
GO
ALTER TABLE [dbo].[office] CHECK CONSTRAINT [FK_office_managerName]
GO
ALTER TABLE [dbo].[office]  WITH CHECK ADD  CONSTRAINT [FK_office_officeAddress] FOREIGN KEY([officeAddress])
REFERENCES [dbo].[addresses] ([addressID])
GO
ALTER TABLE [dbo].[office] CHECK CONSTRAINT [FK_office_officeAddress]
GO
ALTER TABLE [dbo].[office]  WITH CHECK ADD  CONSTRAINT [FK_office_updatedBy] FOREIGN KEY([updatedBy])
REFERENCES [dbo].[admin] ([AID])
GO
ALTER TABLE [dbo].[office] CHECK CONSTRAINT [FK_office_updatedBy]
GO
ALTER TABLE [dbo].[package]  WITH CHECK ADD  CONSTRAINT [FK_package_priority] FOREIGN KEY([deliveryPriority])
REFERENCES [dbo].[deliveryprio] ([deliveryPrio])
GO
ALTER TABLE [dbo].[package] CHECK CONSTRAINT [FK_package_priority]
GO
ALTER TABLE [dbo].[package]  WITH CHECK ADD  CONSTRAINT [FK_package_trackNum] FOREIGN KEY([trackingNumber])
REFERENCES [dbo].[trackinginfo] ([trackingNumber])
GO
ALTER TABLE [dbo].[package] CHECK CONSTRAINT [FK_package_trackNum]
GO
ALTER TABLE [dbo].[payments]  WITH CHECK ADD  CONSTRAINT [FK__payments__packag__1ABEEF0B] FOREIGN KEY([packageID])
REFERENCES [dbo].[package] ([PID])
GO
ALTER TABLE [dbo].[payments] CHECK CONSTRAINT [FK__payments__packag__1ABEEF0B]
GO
ALTER TABLE [dbo].[payments]  WITH CHECK ADD  CONSTRAINT [FK_payment_OID] FOREIGN KEY([OID])
REFERENCES [dbo].[office] ([OID])
GO
ALTER TABLE [dbo].[payments] CHECK CONSTRAINT [FK_payment_OID]
GO
ALTER TABLE [dbo].[statuses]  WITH CHECK ADD FOREIGN KEY([trackingNumber])
REFERENCES [dbo].[trackinginfo] ([trackingNumber])
GO
ALTER TABLE [dbo].[statuses]  WITH CHECK ADD  CONSTRAINT [FK_statuses_nextOffice] FOREIGN KEY([nextOID])
REFERENCES [dbo].[office] ([OID])
GO
ALTER TABLE [dbo].[statuses] CHECK CONSTRAINT [FK_statuses_nextOffice]
GO
ALTER TABLE [dbo].[statuses]  WITH CHECK ADD  CONSTRAINT [FK_statuses_OID] FOREIGN KEY([currOID])
REFERENCES [dbo].[office] ([OID])
GO
ALTER TABLE [dbo].[statuses] CHECK CONSTRAINT [FK_statuses_OID]
GO
ALTER TABLE [dbo].[statuses]  WITH CHECK ADD  CONSTRAINT [FK_statuses_packageID] FOREIGN KEY([PID])
REFERENCES [dbo].[package] ([PID])
GO
ALTER TABLE [dbo].[statuses] CHECK CONSTRAINT [FK_statuses_packageID]
GO
ALTER TABLE [dbo].[supplies]  WITH CHECK ADD FOREIGN KEY([OID])
REFERENCES [dbo].[office] ([OID])
GO
ALTER TABLE [dbo].[trackinginfo]  WITH CHECK ADD FOREIGN KEY([currentStatus])
REFERENCES [dbo].[statuses] ([SID])
GO
ALTER TABLE [dbo].[trackinginfo]  WITH CHECK ADD  CONSTRAINT [FK_tracking_receiverAddress] FOREIGN KEY([receiverAddress])
REFERENCES [dbo].[addresses] ([addressID])
GO
ALTER TABLE [dbo].[trackinginfo] CHECK CONSTRAINT [FK_tracking_receiverAddress]
GO
ALTER TABLE [dbo].[trackinginfo]  WITH CHECK ADD  CONSTRAINT [FK_tracking_receiverName] FOREIGN KEY([receiverName])
REFERENCES [dbo].[names] ([nameID])
GO
ALTER TABLE [dbo].[trackinginfo] CHECK CONSTRAINT [FK_tracking_receiverName]
GO
ALTER TABLE [dbo].[trackinginfo]  WITH CHECK ADD  CONSTRAINT [FK_tracking_senderAddress] FOREIGN KEY([senderAddress])
REFERENCES [dbo].[addresses] ([addressID])
GO
ALTER TABLE [dbo].[trackinginfo] CHECK CONSTRAINT [FK_tracking_senderAddress]
GO
ALTER TABLE [dbo].[trackinginfo]  WITH CHECK ADD  CONSTRAINT [FK_tracking_senderName] FOREIGN KEY([senderName])
REFERENCES [dbo].[names] ([nameID])
GO
ALTER TABLE [dbo].[trackinginfo] CHECK CONSTRAINT [FK_tracking_senderName]
GO
ALTER TABLE [dbo].[truck]  WITH CHECK ADD FOREIGN KEY([OID])
REFERENCES [dbo].[office] ([OID])
GO
ALTER TABLE [dbo].[truck]  WITH CHECK ADD  CONSTRAINT [FK_truck_currDriver] FOREIGN KEY([currDriver])
REFERENCES [dbo].[employee] ([EID])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[truck] CHECK CONSTRAINT [FK_truck_currDriver]
GO
ALTER TABLE [dbo].[employee]  WITH CHECK ADD CHECK  (([userTypeCreate]='manager' OR [userTypeCreate]='admin'))
GO
ALTER TABLE [dbo].[employee]  WITH CHECK ADD CHECK  (([userTypeModify]='admin' OR [userTypeModify]='employee'))
GO
ALTER TABLE [dbo].[supplies]  WITH CHECK ADD  CONSTRAINT [chk_price_positive] CHECK  (([pricePerUnit]>(0)))
GO
ALTER TABLE [dbo].[supplies] CHECK CONSTRAINT [chk_price_positive]
GO
ALTER TABLE [dbo].[supplies]  WITH CHECK ADD  CONSTRAINT [chk_quantity_positive] CHECK  (([quantity]>=(0)))
GO
ALTER TABLE [dbo].[supplies] CHECK CONSTRAINT [chk_quantity_positive]
GO
ALTER DATABASE [group10] SET  READ_WRITE 
GO
