import { PrismaClient } from "../src/prisma/generated/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Starting seed...");

	// Limpiar la base de datos (opcional, comentar si no deseas limpiar)
	console.log("🧹 Cleaning database...");
	await prisma.userProject.deleteMany();
	await prisma.projectSkills.deleteMany();
	await prisma.project.deleteMany();
	await prisma.user.deleteMany();
	await prisma.rolePermission.deleteMany();
	await prisma.permission.deleteMany();
	await prisma.role.deleteMany();
	await prisma.career.deleteMany();
	await prisma.skills.deleteMany();

	// ========== ROLES ==========
	console.log("👥 Creating roles...");
	const adminRole = await prisma.role.create({
		data: {
			name: "ADMIN",
			description: "Administrator with full access to the system",
		},
	});

	const teacherRole = await prisma.role.create({
		data: {
			name: "TEACHER",
			description: "Teacher with access to manage students and projects",
		},
	});

	console.log("✅ Roles created:", {
		admin: adminRole.name,
		teacher: teacherRole.name,
	});

	// ========== PERMISSIONS ==========
	console.log("🔐 Creating permissions...");
	const permissions = await Promise.all([
		prisma.permission.create({
			data: {
				name: "users:create",
				description: "Create new users",
			},
		}),
		prisma.permission.create({
			data: {
				name: "users:read",
				description: "View users",
			},
		}),
		prisma.permission.create({
			data: {
				name: "users:update",
				description: "Update users",
			},
		}),
		prisma.permission.create({
			data: {
				name: "users:delete",
				description: "Delete users",
			},
		}),
		prisma.permission.create({
			data: {
				name: "projects:create",
				description: "Create new projects",
			},
		}),
		prisma.permission.create({
			data: {
				name: "projects:read",
				description: "View projects",
			},
		}),
		prisma.permission.create({
			data: {
				name: "projects:update",
				description: "Update projects",
			},
		}),
		prisma.permission.create({
			data: {
				name: "projects:delete",
				description: "Delete projects",
			},
		}),
		prisma.permission.create({
			data: {
				name: "roles:manage",
				description: "Manage roles and permissions",
			},
		}),
	]);

	console.log(`✅ Created ${permissions.length} permissions`);

	// ========== ROLE PERMISSIONS ==========
	console.log("🔗 Assigning permissions to roles...");

	// Admin tiene todos los permisos
	const adminPermissions = await Promise.all(
		permissions.map((permission) =>
			prisma.rolePermission.create({
				data: {
					roleId: adminRole.id,
					permissionId: permission.id,
				},
			}),
		),
	);

	// Teacher tiene permisos limitados
	const teacherPermissionNames = [
		"projects:create",
		"projects:read",
		"projects:update",
		"users:read",
	];
	const teacherPermissions = await Promise.all(
		permissions
			.filter((p) => teacherPermissionNames.includes(p.name))
			.map((permission) =>
				prisma.rolePermission.create({
					data: {
						roleId: teacherRole.id,
						permissionId: permission.id,
					},
				}),
			),
	);

	console.log(`✅ Assigned ${adminPermissions.length} permissions to ADMIN`);
	console.log(
		`✅ Assigned ${teacherPermissions.length} permissions to TEACHER`,
	);

	// ========== CAREERS ==========
	console.log("🎓 Creating careers...");
	const careers = await Promise.all([
		prisma.career.create({
			data: {
				name: "Ingeniería en Sistemas Computacionales",
			},
		}),
		prisma.career.create({
			data: {
				name: "Ingeniería Industrial",
			},
		}),
		prisma.career.create({
			data: {
				name: "Ingeniería Electrónica",
			},
		}),
		prisma.career.create({
			data: {
				name: "Ingeniería Mecánica",
			},
		}),
		prisma.career.create({
			data: {
				name: "Ingeniería Civil",
			},
		}),
	]);

	console.log(`✅ Created ${careers.length} careers`);

	// ========== SKILLS ==========
	console.log("💪 Creating skills...");
	const skills = await Promise.all([
		prisma.skills.create({
			data: {
				name: "JavaScript",
				description: "JavaScript programming language",
				details: {
					category: "Programming Language",
					level: "Intermediate to Advanced",
				},
			},
		}),
		prisma.skills.create({
			data: {
				name: "TypeScript",
				description: "TypeScript superset of JavaScript",
				details: {
					category: "Programming Language",
					level: "Intermediate to Advanced",
				},
			},
		}),
		prisma.skills.create({
			data: {
				name: "React",
				description: "React JavaScript library for building user interfaces",
				details: {
					category: "Frontend Framework",
					level: "Intermediate",
				},
			},
		}),
		prisma.skills.create({
			data: {
				name: "Node.js",
				description: "Node.js JavaScript runtime",
				details: {
					category: "Backend Runtime",
					level: "Intermediate",
				},
			},
		}),
		prisma.skills.create({
			data: {
				name: "NestJS",
				description: "NestJS progressive Node.js framework",
				details: {
					category: "Backend Framework",
					level: "Advanced",
				},
			},
		}),
		prisma.skills.create({
			data: {
				name: "Python",
				description: "Python programming language",
				details: {
					category: "Programming Language",
					level: "Beginner to Advanced",
				},
			},
		}),
		prisma.skills.create({
			data: {
				name: "Machine Learning",
				description: "Machine learning and AI",
				details: {
					category: "Specialization",
					level: "Advanced",
				},
			},
		}),
		prisma.skills.create({
			data: {
				name: "Database Design",
				description: "Relational and NoSQL database design",
				details: {
					category: "Data Management",
					level: "Intermediate",
				},
			},
		}),
	]);

	console.log(`✅ Created ${skills.length} skills`);

	// ========== USERS ==========
	console.log("👤 Creating users...");
	const hashedPassword = bcrypt.hashSync("password123", 10);

	// Admin user
	const adminUser = await prisma.user.create({
		data: {
			email: "admin@example.com",
			password: hashedPassword,
			name: "Administrator",
			roleId: adminRole.id,
			careerId: careers[0].id, // Sistemas Computacionales
		},
	});

	// Teacher users
	const teacher1 = await prisma.user.create({
		data: {
			email: "teacher1@example.com",
			password: hashedPassword,
			name: "Juan Pérez García",
			roleId: teacherRole.id,
			careerId: careers[0].id, // Sistemas Computacionales
		},
	});

	const teacher2 = await prisma.user.create({
		data: {
			email: "teacher2@example.com",
			password: hashedPassword,
			name: "María López Hernández",
			roleId: teacherRole.id,
			careerId: careers[1].id, // Industrial
		},
	});

	const teacher3 = await prisma.user.create({
		data: {
			email: "teacher3@example.com",
			password: hashedPassword,
			name: "Carlos Ramírez Sánchez",
			roleId: teacherRole.id,
			careerId: careers[2].id, // Electrónica
		},
	});

	console.log("✅ Created users:");
	console.log(`  - Admin: ${adminUser.email}`);
	console.log(`  - Teacher: ${teacher1.email}`);
	console.log(`  - Teacher: ${teacher2.email}`);
	console.log(`  - Teacher: ${teacher3.email}`);

	// ========== PROJECTS ==========
	console.log("📁 Creating projects...");
	const projects = await Promise.all([
		prisma.project.create({
			data: {
				name: "Sistema de Gestión Escolar",
				description:
					"Desarrollo de un sistema web para gestión administrativa y académica",
				status: "in-progress",
				startDate: new Date("2024-09-01"),
				careerId: careers[0].id,
				objectives: [
					"Implementar módulo de gestión de estudiantes",
					"Desarrollar sistema de calificaciones",
					"Crear panel administrativo",
				],
			},
		}),
		prisma.project.create({
			data: {
				name: "Aplicación Móvil de Asistencia",
				description:
					"App móvil para control de asistencia mediante código QR",
				status: "in-progress",
				startDate: new Date("2024-10-01"),
				careerId: careers[0].id,
				objectives: [
					"Implementar generación de códigos QR",
					"Desarrollar lector de QR en dispositivos móviles",
					"Crear sistema de reportes de asistencia",
				],
			},
		}),
		prisma.project.create({
			data: {
				name: "Análisis de Procesos Productivos",
				description:
					"Optimización de línea de producción mediante simulación",
				status: "completed",
				startDate: new Date("2024-08-01"),
				endDate: new Date("2024-11-01"),
				careerId: careers[1].id,
				objectives: [
					"Analizar el proceso actual de producción",
					"Identificar cuellos de botella",
					"Proponer mejoras mediante simulación",
				],
			},
		}),
		prisma.project.create({
			data: {
				name: "Sistema IoT de Monitoreo",
				description: "Sistema de monitoreo con sensores y Arduino",
				status: "in-progress",
				startDate: new Date("2024-09-15"),
				careerId: careers[2].id,
				objectives: [
					"Configurar sensores de temperatura y humedad",
					"Implementar comunicación con servidor",
					"Desarrollar dashboard de visualización",
				],
			},
		}),
		prisma.project.create({
			data: {
				name: "Predicción de Demanda con ML",
				description:
					"Modelo de machine learning para predecir demanda de productos",
				status: "in-progress",
				startDate: new Date("2024-10-15"),
				careerId: careers[0].id,
				objectives: [
					"Recolectar y limpiar datos históricos",
					"Entrenar modelo de predicción",
					"Validar precisión del modelo",
				],
			},
		}),
	]);

	console.log(`✅ Created ${projects.length} projects`);

	// ========== USER PROJECTS ==========
	console.log("🔗 Assigning users to projects...");
	await Promise.all([
		// Teacher 1 en proyectos de sistemas
		prisma.userProject.create({
			data: {
				userId: teacher1.id,
				projectId: projects[0].id,
			},
		}),
		prisma.userProject.create({
			data: {
				userId: teacher1.id,
				projectId: projects[1].id,
			},
		}),
		prisma.userProject.create({
			data: {
				userId: teacher1.id,
				projectId: projects[4].id,
			},
		}),
		// Teacher 2 en proyecto de industrial
		prisma.userProject.create({
			data: {
				userId: teacher2.id,
				projectId: projects[2].id,
			},
		}),
		// Teacher 3 en proyecto de electrónica
		prisma.userProject.create({
			data: {
				userId: teacher3.id,
				projectId: projects[3].id,
			},
		}),
	]);

	console.log("✅ User-Project assignments created");

	// ========== PROJECT SKILLS ==========
	console.log("💪 Assigning skills to projects...");
	await Promise.all([
		// Sistema de Gestión Escolar - NestJS, TypeScript, Database Design
		prisma.projectSkills.create({
			data: {
				projectId: projects[0].id,
				skillId: skills[4].id, // NestJS
			},
		}),
		prisma.projectSkills.create({
			data: {
				projectId: projects[0].id,
				skillId: skills[1].id, // TypeScript
			},
		}),
		prisma.projectSkills.create({
			data: {
				projectId: projects[0].id,
				skillId: skills[7].id, // Database Design
			},
		}),
		// Aplicación Móvil - React, JavaScript
		prisma.projectSkills.create({
			data: {
				projectId: projects[1].id,
				skillId: skills[2].id, // React
			},
		}),
		prisma.projectSkills.create({
			data: {
				projectId: projects[1].id,
				skillId: skills[0].id, // JavaScript
			},
		}),
		// Análisis de Procesos - Python
		prisma.projectSkills.create({
			data: {
				projectId: projects[2].id,
				skillId: skills[5].id, // Python
			},
		}),
		// Sistema IoT - Node.js, JavaScript
		prisma.projectSkills.create({
			data: {
				projectId: projects[3].id,
				skillId: skills[3].id, // Node.js
			},
		}),
		prisma.projectSkills.create({
			data: {
				projectId: projects[3].id,
				skillId: skills[0].id, // JavaScript
			},
		}),
		// Predicción con ML - Python, Machine Learning
		prisma.projectSkills.create({
			data: {
				projectId: projects[4].id,
				skillId: skills[6].id, // Machine Learning
			},
		}),
		prisma.projectSkills.create({
			data: {
				projectId: projects[4].id,
				skillId: skills[5].id, // Python
			},
		}),
	]);

	console.log("✅ Project-Skills assignments created");

	console.log("\n🎉 Seed completed successfully!");
	console.log("\n📝 Test Credentials:");
	console.log("  Admin:");
	console.log("    Email: admin@example.com");
	console.log("    Password: password123");
	console.log("\n  Teachers:");
	console.log("    Email: teacher1@example.com");
	console.log("    Email: teacher2@example.com");
	console.log("    Email: teacher3@example.com");
	console.log("    Password: password123 (for all)");
}

main()
	.catch((e) => {
		console.error("❌ Error during seed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
