# Linear

Linear app for Attio, built with the [App SDK](https://docs.attio.com/sdk/introduction).

## Overview

Log customer requests and sync customer details to Linear right from Attio. Sellers capture customer feedback in one click, giving product and engineering teams clear priorities linked to every deal. Tight feedback loops between the product and the sale keep insights flowing and deals moving.

## Features

From any Company, Person, or Deal record in Attio, click the Linear icon or use a quick action to log a customer request or view the customer’s page in Linear.

To log a customer request, add the details in the description field to include in the request in Linear. You can add requests to an existing issue or project, or create a new issue. Requests will automatically be logged with the corresponding customer in Linear.

You can also log a request directly from a call transcript or summary. Just highlight the text you want to include in the description. The call recording will be linked automatically to the request.

## Source folder structure

 <!-- TODO: add link to widgets and text selection actions docs once they're written -->

| Path                 | Description                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------ |
| `src/assets`         | Static assets                                                                              |
| `src/attio`          | Code interacting with the [Attio API](https://docs.attio.com/rest-api/overview)            |
| `src/components`     | Shared React components                                                                    |
| `src/graphql`        | GraphQL queries for the [Attio GraphQL schema](https://docs.attio.com/sdk/graphql/graphql) |
| `src/linear`         | Linear-specific logic, organized by domain                                                 |
| `src/record/actions` | [Record actions](https://docs.attio.com/sdk/actions/record-action)                         |
| `src/record/widgets` | Widgets                                                                                    |
| `src/text-selection` | Text selection actions for transcripts, call insights and summaries                        |
| `src/utils`          | Shared utility functions                                                                   |
