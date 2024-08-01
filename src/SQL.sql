DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'empresa') THEN
        CREATE TABLE empresa (
			id BIGINT PRIMARY KEY,
			name VARCHAR(50) NOT NULL,
			nit BIGINT NOT NULL,
			description VARCHAR(200) NULL,
			address VARCHAR(100) NULL,
			active BIT NOT NULL,
			fecha_creacion DATE NOT NULL
		);
    ELSE
        RAISE NOTICE 'La tabla empresa ya existe.';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contact') THEN
        CREATE TABLE contact (
			id BIGINT PRIMARY KEY,
			number BIGINT NOT NULL,
			message VARCHAR(200) NOT NULL,
			fecha_creacion DATE NOT NULL
		);
    ELSE
        RAISE NOTICE 'La tabla contact ya existe.';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product') THEN
        CREATE TABLE product (
			id BIGINT PRIMARY KEY,
			name VARCHAR (50) NOT NULL,
			description VARCHAR (50) NOT NULL,
			type BIGINT NOT NULL,
			img VARCHAR (200) NULL,
			price BIGINT NOT NULL,
            fecha_creacion DATE NOT NULL
		);
    ELSE
        RAISE NOTICE 'La tabla product ya existe.';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'type') THEN
        CREATE TABLE type (
			id BIGINT PRIMARY KEY,
			name VARCHAR (50) NOT NULL,
			url VARCHAR (200) NOT NULL,
			fecha_creacion DATE NOT NULL
		);
    ELSE
        RAISE NOTICE 'La tabla type ya existe.';
    END IF;
END $$;