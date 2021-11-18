# Domain model

![image](https://user-images.githubusercontent.com/9356633/59146634-e22ea000-8a1a-11e9-974b-284ef7c0366d.png)

## Business

- Business can be created by any user of Kedul

## BusinessMember

- Business members belong to a business and can manage its resources depending on their role.
  These are actual users that get invited to the business

## Product

- Product has many variants - ProductVariant
- Each ProductVariant has a stock. ProductVariantStock
- ProductVariantStock is maintained at each location separately

## Client

- Client is accessed and used across all business and their locations

## Employee

Employee equals BusinessMember except for the following differences:

- Employee works at a specific location.
- Employee can be treated as resource. Which means there may not be actual user attached to Employee
  and is created manually by the administrator
- Employee may be attached to a BusinessMember
- Employees are operational. i.e. work is tracked at this level.

## Service

- Actual service performed

## Appointment

- Client book appointments at individual location
- Appointment has a set of services to be performed

## Invoice

- Invoice is generated for services and products sold
