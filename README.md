# BotaniTree Demo
DISCLAIMER: This is a non-persistent demo application showcasing the key features of the BotaniTree, which is still a work in progress. The information about the technologies used may not fully in reflect this demo. The backend code for the non demo version of this application is available [here](https://github.com/jackhannon/BotaniTree-backend).

BotaniTree is a web application designed to help users track and visualize the familial relationships of individual plants within specific species through detailed pedigrees.

Use Case Example:

Imagine you are interested in selecting for specific morphological or chemical characteristics within a plant species.
Assuming you are working with hundreds or even thousands of individuals, it will prove a difficult task to keep track 
of their specific familial lineages without a GUI, which is very important if we are selecting for specific inherited 
characteristics.

## Key Features

 - Tree View: Visualizes the lineage of a plant in a "family tree" or pedigree structure, showing the children of any given individual.
![Tree View](https://i.gyazo.com/83e1788cd815af940ed616ecac4e4beb.png)

 - Grid View: Offers a simplified, filterable, and sortable view of individuals within a species.

 - Detailed Controls: Provides low-level control over individual parameters such as watering schedules and substrate compositions, with defaults based on species but customizable per individual.


Some features in this application may not be easy to understand without greater familiarity with the problem domain, please reference this guide for some of those features if that is the case:
![guide](https://i.gyazo.com/da0934e1e41cb5036ab5a83f2539a0ed.png)

## Tech stack

Frontend built with:
 - React
 - Redux (including RTK query)
 - Tanstack-Router
 - TypeScript

Backend built with:
 - Postgres
 - Express
 - NodeJS

System Info:
 - Node version - 18.12.1
 - Browser and version - Chrome version 124.0.6367.203
 - Postgres version - 16.1

## Copyright Notice

© 2024, Jack Hannon. All rights reserved.

This project and its contents are proprietary information. No license is granted to copy, modify, distribute, or use the code and content for any purpose without express written permission from the copyright holder.
