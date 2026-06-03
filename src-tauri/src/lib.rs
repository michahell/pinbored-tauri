use tauri_plugin_sql::{Migration, MigrationKind};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // This should be called as early in the execution of the app as possible
    #[cfg(debug_assertions)] // only enable instrumentation in development builds
    let devtools = tauri_plugin_devtools::init();

    let platform = tauri_plugin_os::platform();
    println!("Platform: {}", platform);
    // Prints "windows" to the terminal

    // SQLite migrations
    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "0001_create_pinboard_tables",
            sql: include_str!("../migrations/0001_create_pinboard_tables.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "0002_alter_pinboard_tables",
            sql: include_str!("../migrations/0002_alter_pinboard_tables.sql"),
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "0003_add_dummy_data",
            sql: include_str!("../migrations/0003_add_dummy_data.sql"),
            kind: MigrationKind::Up,
        },
    ];

    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:pinbored.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build());

    #[cfg(debug_assertions)]
    {
        builder = builder.plugin(devtools);
    }

    builder
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
