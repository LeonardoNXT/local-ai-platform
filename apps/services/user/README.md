# User Service

## Overview

The **User Service** is a domain-focused microservice responsible for managing the lifecycle and state of user accounts within the platform. It encapsulates the domain logic related to user creation, authentication, and account status management while exposing its capabilities through a gRPC interface.

This service is designed following **Domain-Driven Design (DDD)** and **Clean Architecture** principles, ensuring strong separation between domain logic, application orchestration, and infrastructure concerns.

The service integrates with other components of the system through **gRPC contracts** and **event-driven messaging**, enabling reliable communication and eventual consistency across the platform.

---

## Responsibilities

The User Service is responsible for:

- User account creation
- User authentication
- User status lifecycle management
- Domain event publication
- Persistence of user entities
- Integration with messaging infrastructure

Specifically, it supports the following operations:

- Create user accounts
- Authenticate users
- Deactivate accounts
- Suspend accounts
- Ban users
- Reactivate accounts

The service enforces domain invariants through **value objects**, **domain entities**, and **domain events**.

---

## Architectural Principles

This service follows the principles of **Clean Architecture**, separating concerns into distinct layers:

```

Domain
Application
Infrastructure

```

Each layer has clear responsibilities and strict dependency direction.

### Domain Layer

The domain layer contains the core business logic and domain model. It is fully independent from infrastructure and external frameworks.

Key components include:

- **Entities**
  Core business objects representing users and their state.

- **Value Objects**
  Encapsulated domain primitives enforcing validation and invariants.

- **Domain Events**
  Events emitted when significant domain state transitions occur.

- **Domain Services**
  Services encapsulating domain logic that does not belong to a single entity.

Examples from the codebase:

```

domain/entity/user
domain/value-object
domain/events
domain/services

```

The domain layer does not depend on any external framework.

---

### Application Layer

The application layer orchestrates domain operations through **use cases**. It defines how the domain is interacted with by external actors.

Responsibilities include:

- Coordinating domain operations
- Managing transactions
- Enforcing application-level policies
- Interacting with external ports through gateways

The application layer communicates with infrastructure through **ports (gateways)** that define abstract contracts.

Examples:

```

application/usecases/create-user
application/usecases/login-user
application/usecases/status
application/gateway

```

Use cases represent the executable business actions exposed by the service.

---

### Infrastructure Layer

The infrastructure layer contains implementations for external systems and technical concerns.

Responsibilities include:

- Database persistence
- Cache access
- Message publishing
- gRPC transport
- Cryptographic utilities

Examples:

```

infra/database
infra/repositories
infra/server/grpc
infra/cache
infra/cryptography
infra/events

```

Infrastructure implementations conform to contracts defined in the application layer.

---

## Domain Model

The domain model revolves around the **User aggregate**, which represents the authoritative source of truth for user-related state.

### Aggregate Root

```

User

```

The User aggregate enforces business rules around:

- Account creation
- Credential validation
- Status transitions
- Domain event emission

### Value Objects

The domain relies on strongly typed value objects to ensure correctness and enforce validation:

- Email
- Password
- HashedPassword
- Name
- Birthday
- Account Status
- Suspension or Ban Reason

Value objects guarantee that invalid data cannot enter the domain model.

---

## Domain Events

The service emits domain events when meaningful state transitions occur.

Examples include:

```

UserCreatedDomainEvent
UserBannedDomainEvent

```

These events are captured and persisted using the **Outbox Pattern**, ensuring reliable publication to the messaging system.

---

## Messaging and Event Delivery

The service integrates with Kafka through a messaging abstraction provided by shared infrastructure packages.

To guarantee reliable event publication, the service implements the **Transactional Outbox Pattern**.

The process is as follows:

1. Domain events are generated inside aggregates.
2. Events are captured during persistence.
3. Events are stored in an Outbox table within the same database transaction.
4. A background worker reads unprocessed events.
5. Events are published to Kafka.
6. Events are marked as processed.

This design prevents dual-write inconsistencies between the database and the message broker.

---

## Persistence

Persistence is implemented using **TypeORM**.

The service maintains the following primary entities:

- `UserOrmEntity`
- `OutboxOrmEntity`

Repositories translate between:

- Domain entities
- ORM entities

Mappers ensure that the domain layer remains persistence-agnostic.

---

## Transport Layer

External communication is handled via **gRPC**.

The service exposes its operations through gRPC handlers implemented in:

```

infra/server/grpc

```

Adapters translate incoming requests into application use cases.

Example flow:

```

gRPC Request
↓
Handler Adapter
↓
Application Use Case
↓
Domain Model
↓
Repository

```

This design isolates transport concerns from business logic.

---

## Cache Layer

Redis is used as a distributed cache and temporary data store for specific operations such as password reset tokens.

Cache interactions are implemented through dedicated repository implementations within the infrastructure layer.

---

## Security

Password hashing is performed using **Argon2**, implemented through a dedicated cryptographic service.

Plaintext credentials never enter the domain model without validation and transformation through domain value objects.

---

## Error Handling

Errors are categorized according to architectural boundaries:

- Domain errors
- Application errors
- Infrastructure errors

Error contracts ensure consistent propagation and mapping across layers.

gRPC error responses are mapped using dedicated error mappers.

---

## Project Structure

```

src
├── application
├── domain
├── errors
├── infra
├── shared
└── main.ts

```

Each directory reflects an architectural boundary.

---

## Dependencies

Key dependencies include:

- TypeORM (data persistence)
- KafkaJS (event streaming)
- gRPC (service communication)
- Redis (caching)
- Argon2 (password hashing)

Shared infrastructure libraries are consumed via workspace packages:

```

@geo/shared-grpc
@geo/shared-messenger

```

These packages provide reusable components for messaging and gRPC integration across services.

---

## Running the Service

Install dependencies:

```

pnpm install

```

Run the service in development mode:

```

pnpm dev

```

The service starts a gRPC server and initializes required infrastructure components.

---

## Current Status

This service is currently under active development. Core architectural components and domain structures are established, with ongoing work focused on expanding capabilities and improving integration with other platform services.

---

## Architectural Notes

This service prioritizes:

- Explicit domain modeling
- Strict separation of concerns
- Infrastructure isolation
- Reliable event delivery
- Service interoperability

The architecture aims to support long-term maintainability and scalability in a distributed system environment.
