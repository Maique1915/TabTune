export type Language = 'pt' | 'en' | 'es';

export const translations = {
    pt: {
        menu: {
            studio_mode: 'Modo Estúdio',
            project: 'Projeto',
            harmony: 'Harmonia',
            editor: 'Editor',
            upgrade_plan: 'Plano Premium',
        },
        generic: {
            engine: 'Motor NoteForge',
            active: 'NoteForge Ativo',
            reset: 'Redefinir Padrões'
        },
        header: {
            guest_user: 'Usuário Convidad',
            free_plan: 'Plano Grátis',
            view_profile: 'Ver Perfil',
            login: 'Entrar',
            share: 'Compartilhar',
            import: 'Importar',
            export: 'Exportar',
        },
        editor: {
            fretboard: 'Braço',
            duration: 'Duração',
            actions: 'Ações',
        },
        harmony: {
            root_tone: 'Tônica & Tom',
            quality: 'Qualidade',
            extensions: 'Extensões',
            bass_note: 'Nota Baixo',
            root: 'RAIZ',
            empty: {
                title: 'Nenhum Compasso Selecionado',
                desc: 'Selecione um compasso para definir sua estrutura harmônica.',
                features: {
                    root_quality: 'Definir Tônica & Qualidade',
                    extensions: 'Adicionar Extensões Musicais',
                    bass: 'Variações da Nota Baixo'
                }
            }
        },
        timeline: {
            add_block: 'Adicionar Bloco',
            drag_reorder: 'Arraste para reordenar',
        },
        actions: {
            duplicate: 'Duplicar',
            delete: 'Excluir',
        },
        page: {
            features: 'Funcionalidades',
            creators: 'Criadores',
            pricing: 'Preços',
            login: 'Entrar',
            start_creating: 'Começar a Criar',
            hero: {
                badge: 'Agora com Renderização 4K',
                title_start: 'Acordes Animados para',
                title_end: 'Criadores de Guitarra',
                subtitle: 'Animações de braço de nível profissional para aulas, redes sociais e cursos. Crie cifras cinemáticas em segundos.',
                cta_primary: 'Começar Grátis',
                cta_secondary: 'Ver Demo'
            },
            demo: {
                chord_type: 'Tipo de Acorde',
                animation_state: 'Estado da Animação',
                rendering: 'Renderizando...',
                mock_filename: 'CIFRAI_ESTUDIO_V2.EXE',
                mock_chord: 'Dó Maior 7 (Add 9)'
            },
            features_section: {
                title: 'Projetado para Excelência',
                subtitle: 'Experimente o futuro da criação de conteúdo de guitarra com ferramentas construídas para velocidade, qualidade cinemática e precisão absoluta.',
                explore: 'Explorar todas as ferramentas',
                short_view: {
                    title: 'Visão Curta',
                    desc: 'Diagramas de acordes verticais focados em acordes individuais. Ideal para cifras rápidas e exportação em PDF.'
                },
                full_view: {
                    title: 'Visão Completa',
                    desc: 'Visualização horizontal completa do braço. Perfeito para escalas, corridas complexas e renderização de todo o braço.'
                },
                beats: {
                    title: 'Batidas de Guitarra',
                    desc: 'Editor dedicado de ritmo e padrões de batida. Crie e visualize batidas de guitarra complexas independentemente.'
                }
            },
            cta: {
                title: 'Pronto para transformar suas aulas?',
                desc: 'Junte-se a mais de 5.000+ criadores de guitarra fazendo visuais de classe mundial com Cifrai. Nenhuma habilidade de design necessária.',
                button_primary: 'Começar Grátis',
                button_secondary: 'Ver Planos'
            },
            footer: {
                terms: 'Termos de Serviço',
                privacy: 'Política de Privacidade',
                discord: 'Comunidade Discord',
                rights: '© 2024 Cifrai Animator. Todos os direitos reservados.'
            },
        },
        settings: {
            tabs: {
                basic: 'Básico',
                advanced: 'Avançado',
                motion: 'Movimento'
            },
            headers: {
                visual_presets: 'Predefinições Visuais',
                components: 'Componentes',
                view_transform: 'Transformação de Vista',
                animation_type: 'Tipo de Animação'
            },
            presets: {
                label: 'Estilos Profissionais',
                customize: 'Personalize o estilo de saída'
            },
            groups: {
                global: 'Global & Vista',
                neck: 'Braço & Mão',
                inlays: 'Marcadores',
                strings_frets: 'Cordas & Trastes',
                fingers: 'Dedos',
                labels: 'Rótulos & Capo'
            },
            labels: {
                background: 'Fundo',
                global_scale: 'Escala Global',
                neck_color: 'Cor do Braço',
                neck_shadow: 'Sombra do Braço',
                headstock_color: 'Cor da Mão',
                head_border: 'Borda da Mão',
                head_shadow: 'Sombra da Mão',
                inlays_color: 'Cor dos Marcadores',
                opacity: 'Opacidade',
                strings_color: 'Cor das Cordas',
                frets_color: 'Cor dos Trastes',
                fill_color: 'Cor de Preenchimento',
                text_color: 'Cor do Texto',
                border_color: 'Cor da Borda',
                chord_name: 'Nome do Acorde',
                capo_color: 'Cor do Capo',
                rotation: 'Rotação'
            },
            animations: {
                carousel: {
                    title: 'Carrossel',
                    desc: 'Fluxo contínuo de acordes deslizando pela tela.'
                },
                static: {
                    title: 'Braço Estático',
                    desc: 'Apenas os dedos se movem. O braço permanece fixo.'
                }
            }
        },
        beats: {
            map_title: 'Mapa de Batidas',
            add_beat: '+ ADICIONAR BATIDA',
            add_first_beat: '+ ADICIONAR PRIMEIRA BATIDA',
            measure_empty_title: 'Compasso Vazio',
            measure_empty_desc: 'Comece a construir seu ritmo adicionando sua primeira batida.',
            select_measure_title: 'Nenhum Compasso Selecionado',
            select_measure_desc: 'Selecione um compasso para começar a editar.',
            duration: 'Duração',
            direction: 'Direção',
            down: 'BAIXO',
            up: 'CIMA',
            pause: 'PAUSA',
            mute: 'ABAFADO',
            accent: 'Acento',
            strong_beat: 'Batida Forte',
            strum_finger: 'Dedo da Batida',
            config: {
                title: 'Configuração Global',
                tempo: 'Tempo',
                sync: 'Sincronizar Animação',
                time_sig: 'Compasso'
            }
        },
        sidebar: {
            project: 'Projeto',
            editor: 'Editor',
            settings: 'Configurações',
            harmony: 'Harmonia',
            rhythm: 'Ritmo',
            fretboard: 'Braço',
            actions: 'Ações',
            upgrade: 'Plano Pro'
        },
        fretboard: {
            map_title: 'Mapa do Braço',
            add_string: '+ ADICIONAR CORDA',
            no_notes: 'Nenhuma nota no braço',
            select_string: '1. Selecionar Corda',
            select_finger: '2. Selecionar Dedo',
            select_fret: '3. Selecionar Traste',
            fret: 'TRASTE',
            nut: 'PESTANA',
            barre_selector: '4. Selecionar Pestana',
            add_barre: '+ ADICIONAR PESTANA',
            barre_to: '4. Pestana Até',
            barre_instruction: 'Selecione uma nota e clique no número da corda onde a pestana deve terminar.',
            empty_title: 'Selecione uma Nota',
            empty_desc: 'Escolha uma nota ou acorde na timeline para editar no braço.',
            feature_finger: 'Mapear dedos',
            feature_fret: 'Selecionar trastes',
            feature_barre: 'Editar pestanas',
            remove: 'REMOVER'
        },
        music: {
            root_tone: 'Tônica & Tom',
            quality: 'Qualidade',
            extensions: 'Extensões',
            bass_note: 'Nota Baixo',
            root: 'TÔNICA',
            quality_options: {
                major: 'Maior',
                minor: 'Menor',
                dim: 'Diminuta',
                aug: 'Aumentada',
                sus2: 'Sus2',
                sus4: 'Sus4',
                maj7: 'Sétima Maior'
            }
        },
        projects: {
            save_dialog: {
                title: 'Salvar Projeto',
                subtitle: 'Dê um nome ao seu projeto',
                project_name: 'Nome do Projeto',
                placeholder: 'Meu Projeto Incrível',
                save: 'Salvar',
                saving: 'Salvando...',
                cancel: 'Cancelar'
            }
        }

    },
    en: {
        menu: {
            studio_mode: 'Studio Mode',
            project: 'Project',
            harmony: 'Harmony',
            editor: 'Editor',
            upgrade_plan: 'Upgrade Plan',
        },
        generic: {
            engine: 'NoteForge Engine',
            active: 'NoteForge Active',
            reset: 'Reset Defaults'
        },
        header: {
            guest_user: 'Guest User',
            free_plan: 'Free Plan',
            view_profile: 'View Profile',
            login: 'Log In',
            share: 'Share',
            import: 'Import',
            export: 'Export',
        },
        editor: {
            fretboard: 'Fretboard',
            duration: 'Duration',
            actions: 'Actions',
        },
        harmony: {
            root_tone: 'Root & Tone',
            quality: 'Quality',
            extensions: 'Extensions',
            bass_note: 'Bass Note',
            root: 'ROOT',
            empty: {
                title: 'No Measure Selected',
                desc: 'Select a measure to define its harmonic structure.',
                features: {
                    root_quality: 'Define Root & Quality',
                    extensions: 'Add Musical Extensions',
                    bass: 'Set Bass Note Variations'
                }
            }
        },
        timeline: {
            add_block: 'Add Block',
            drag_reorder: 'Drag to reorder',
        },
        actions: {
            duplicate: 'Duplicate',
            delete: 'Delete',
        },
        page: {
            features: 'Features',
            creators: 'Creators',
            pricing: 'Pricing',
            login: 'Log In',
            start_creating: 'Start Creating',
            hero: {
                badge: 'Now with 4K Rendering',
                title_start: 'Animated Chords for',
                title_end: 'Guitar Creators',
                subtitle: 'Professional-grade fretboard animations for lessons, social media, and courses. Build cinematic chord charts in seconds.',
                cta_primary: 'Start Creating Free',
                cta_secondary: 'View Demo'
            },
            demo: {
                chord_type: 'Chord Type',
                animation_state: 'Animation State',
                rendering: 'Rendering...',
                mock_filename: 'CIFRAI_STUDIO_V2.EXE',
                mock_chord: 'C Major 7 (Add 9)'
            },
            features_section: {
                title: 'Designed for Excellence',
                subtitle: 'Experience the future of guitar content creation with tools built for speed, cinematic quality, and absolute precision.',
                explore: 'Explore all tools',
                short_view: {
                    title: 'Short View',
                    desc: 'Vertical chord diagrams focused on individual chords. Ideal for quick charts and PDF exports.'
                },
                full_view: {
                    title: 'Full View',
                    desc: 'Complete horizontal fretboard visualization. Perfect for scales, intricate runs, and full neck rendering.'
                },
                beats: {
                    title: 'Guitar Beats',
                    desc: 'Dedicated rhythm and strumming pattern editor. Create and visualize complex guitar beats independently.'
                }
            },
            cta: {
                title: 'Ready to transform your lessons?',
                desc: 'Join over 5,000+ guitar creators making world-class visuals with Cifrai. No design skills required.',
                button_primary: 'Get Started For Free',
                button_secondary: 'View Pricing Plans'
            },
            footer: {
                terms: 'Terms of Service',
                privacy: 'Privacy Policy',
                discord: 'Discord Community',
                rights: '© 2024 Cifrai Animator. All rights reserved.'
            },
        },
        settings: {
            tabs: {
                basic: 'Basic',
                advanced: 'Advanced',
                motion: 'Motion'
            },
            headers: {
                visual_presets: 'Visual Presets',
                components: 'Components',
                view_transform: 'View Transform',
                animation_type: 'Animation Type'
            },
            presets: {
                label: 'Professional Styles',
                customize: 'Customize render output style'
            },
            groups: {
                global: 'Global & View',
                neck: 'Neck & Headstock',
                inlays: 'Inlays (Markers)',
                strings_frets: 'Strings & Frets',
                fingers: 'Fingers',
                labels: 'Labels & Capo'
            },
            labels: {
                background: 'Background',
                global_scale: 'Global Scale',
                neck_color: 'Neck Color',
                neck_shadow: 'Neck Shadow',
                headstock_color: 'Headstock Color',
                head_border: 'Head Border',
                head_shadow: 'Head Shadow',
                inlays_color: 'Inlays Color',
                opacity: 'Opacity',
                strings_color: 'Strings Color',
                frets_color: 'Frets Color',
                fill_color: 'Fill Color',
                text_color: 'Text Color',
                border_color: 'Border Color',
                chord_name: 'Chord Name',
                capo_color: 'Capo Color',
                rotation: 'Rotation'
            },
            animations: {
                carousel: {
                    title: 'Carousel',
                    desc: 'Flowing stream of chords sliding across the screen.'
                },
                static: {
                    title: 'Static Fretboard',
                    desc: 'Only fingers move. Fretboard remains fixed.'
                }
            }
        },
        beats: {
            map_title: 'Beats Map',
            add_beat: '+ ADD BEAT',
            add_first_beat: '+ ADD FIRST BEAT',
            measure_empty_title: 'Measure is Empty',
            measure_empty_desc: 'Start building your rhythm by adding your first beat.',
            select_measure_title: 'No Measure Selected',
            select_measure_desc: 'Select a measure to start being edited.',
            duration: 'Duration',
            direction: 'Direction',
            down: 'DOWN',
            up: 'UP',
            pause: 'PAUSE',
            mute: 'MUTE',
            accent: 'Accent',
            strong_beat: 'Strong Beat',
            strum_finger: 'Strum Finger',
            config: {
                title: 'Global Config',
                tempo: 'Tempo',
                sync: 'Sync Animation',
                time_sig: 'Time Signature'
            }
        },
        sidebar: {
            project: 'Project',
            editor: 'Editor',
            settings: 'Settings',
            harmony: 'Harmony',
            rhythm: 'Rhythm',
            fretboard: 'Fretboard',
            actions: 'Actions',
            upgrade: 'Upgrade Plan'
        },
        fretboard: {
            map_title: 'Fretboard Map',
            add_string: '+ ADD STRING',
            no_notes: 'No notes placed on fretboard',
            select_string: '1. Select String',
            select_finger: '2. Select Finger',
            select_fret: '3. Select Fret',
            fret: 'FRET',
            nut: 'NUT',
            barre_selector: '4. Select Barre',
            add_barre: '+ ADD BARRE',
            barre_to: '4. Barre To',
            barre_instruction: 'Select a note and click the string number where the barre should end.',
            empty_title: 'Select a Note',
            empty_desc: 'Choose a note or chord in the timeline to edit on the fretboard.',
            feature_finger: 'Map fingers',
            feature_fret: 'Select frets',
            feature_barre: 'Edit barres',
            remove: 'REMOVE'
        },
        music: {
            root_tone: 'Root & Tone',
            quality: 'Quality',
            extensions: 'Extensions',
            bass_note: 'Bass Note',
            root: 'ROOT',
            quality_options: {
                major: 'Major',
                minor: 'Minor',
                dim: 'Diminished',
                aug: 'Augmented',
                sus2: 'Sus2',
                sus4: 'Sus4',
                maj7: 'Major 7th Style'
            }
        },
        projects: {
            save_dialog: {
                title: 'Save Project',
                subtitle: 'Give your project a name',
                project_name: 'Project Name',
                placeholder: 'My Awesome Project',
                save: 'Save',
                saving: 'Saving...',
                cancel: 'Cancel'
            }
        }

    },
    es: {
        menu: {
            studio_mode: 'Modo Estudio',
            project: 'Proyecto',
            harmony: 'Armonía',
            editor: 'Editor',
            upgrade_plan: 'Plan Premium',
        },
        generic: {
            engine: 'Motor NoteForge',
            active: 'NoteForge Activo',
            reset: 'Restablecer Valores'
        },
        header: {
            guest_user: 'Usuario Invitado',
            free_plan: 'Plan Gratis',
            view_profile: 'Ver Perfil',
            login: 'Iniciar Sesión',
            share: 'Compartir',
            import: 'Importar',
            export: 'Exportar',
        },
        editor: {
            fretboard: 'Diapasón',
            duration: 'Duración',
            actions: 'Acciones',
        },

        harmony: {
            root_tone: 'Tónica y Tono',
            quality: 'Calidad',
            extensions: 'Extensiones',
            bass_note: 'Nota Bajo',
            root: 'RAÍZ',
            empty: {
                title: 'Ningún Compás Seleccionado',
                desc: 'Seleccione un compás para definir su estructura armónica.',
                features: {
                    root_quality: 'Definir Tónica & Calidad',
                    extensions: 'Añadir Extensiones Musicales',
                    bass: 'Variaciones de Nota Bajo'
                }
            }
        },
        timeline: {
            add_block: 'Añadir Bloque',
            drag_reorder: 'Arrastrar para reordenar',
        },
        actions: {
            duplicate: 'Duplicar',
            delete: 'Eliminar',
        },
        page: {
            features: 'Funcionalidades',
            creators: 'Creadores',
            pricing: 'Precios',
            login: 'Iniciar Sesión',
            start_creating: 'Empezar a Crear',
            hero: {
                badge: 'Ahora con Renderizado 4K',
                title_start: 'Acordes Animados para',
                title_end: 'Creadores de Guitarra',
                subtitle: 'Animaciones de diapasón de nivel profesional para lecciones, redes sociales y cursos. Crea gráficos de acordes cinematográficos en segundos.',
                cta_primary: 'Empezar Gratis',
                cta_secondary: 'Ver Demo'
            },
            demo: {
                chord_type: 'Tipo de Acorde',
                animation_state: 'Estado de Animación',
                rendering: 'Renderizando...',
                mock_filename: 'CIFRAI_ESTUDIO_V2.EXE',
                mock_chord: 'Do Mayor 7 (Add 9)'
            },
            features_section: {
                title: 'Diseñado para la Excelencia',
                subtitle: 'Experimenta el futuro de la creación de contenido de guitarra con herramientas creadas para velocidad, calidad cinematográfica y precisión absoluta.',
                explore: 'Explorar todas las herramientas',
                short_view: {
                    title: 'Vista Corta',
                    desc: 'Diagramas de acordes verticales enfocados en acordes individuales. Ideal para gráficos rápidos y exportaciones PDF.'
                },
                full_view: {
                    title: 'Vista Completa',
                    desc: 'Visualización horizontal completa del diapasón. Perfecto para escalas, ejecuciones complejas y renderizado de mástil completo.'
                },
                beats: {
                    title: 'Ritmos de Guitarra',
                    desc: 'Editor dedicado de ritmo y patrones de rasgueo. Crea y visualiza ritmos de guitarra complejos de forma independiente.'
                }
            },
            cta: {
                title: '¿Listo para transformar tus lecciones?',
                desc: 'Únete a más de 5,000+ creadores de guitarra haciendo visuales de clase mundial con Cifrai. No se requieren habilidades de diseño.',
                button_primary: 'Empezar Gratis',
                button_secondary: 'Ver Planes'
            },
            footer: {
                terms: 'Términos de Servicio',
                privacy: 'Política de Privacidad',
                discord: 'Comunidad de Discord',
                rights: '© 2024 Cifrai Animator. Todos los derechos reservados.'
            },
        },
        settings: {
            tabs: {
                basic: 'Básico',
                advanced: 'Avanzado',
                motion: 'Movimiento'
            },
            headers: {
                visual_presets: 'Preajustes Visuales',
                components: 'Componentes',
                view_transform: 'Transformación de Vista',
                animation_type: 'Tipo de Animación'
            },
            presets: {
                label: 'Estilos Profesionales',
                customize: 'Personalizar estilo de salida'
            },
            groups: {
                global: 'Global & Vista',
                neck: 'Mástil & Pala',
                inlays: 'Marcadores',
                strings_frets: 'Cuerdas & Trastes',
                fingers: 'Dedos',
                labels: 'Etiquetas & Cejilla'
            },
            labels: {
                background: 'Fondo',
                global_scale: 'Escala Global',
                neck_color: 'Color del Mástil',
                neck_shadow: 'Sombra del Mástil',
                headstock_color: 'Color de la Pala',
                head_border: 'Borde de la Pala',
                head_shadow: 'Sombra de la Pala',
                inlays_color: 'Color de Marcadores',
                opacity: 'Opacidad',
                strings_color: 'Color de Cuerdas',
                frets_color: 'Color de Trastes',
                fill_color: 'Color de Relleno',
                text_color: 'Color de Texto',
                border_color: 'Color del Borde',
                chord_name: 'Nombre del Acorde',
                capo_color: 'Color de Cejilla',
                rotation: 'Rotación'
            },
            animations: {
                carousel: {
                    title: 'Carrusel',
                    desc: 'Flujo continuo de acordes deslizándose por la pantalla.'
                },
                static: {
                    title: 'Diapasón Estático',
                    desc: 'Solo los dedos se mueven. El diapasón permanece fijo.'
                }
            }
        },
        beats: {
            map_title: 'Mapa de Ritmos',
            add_beat: '+ AÑADIR ESCALÓN',
            add_first_beat: '+ AÑADIR PRIMER ESCALÓN',
            measure_empty_title: 'Compás Vacío',
            measure_empty_desc: 'Comience a construir su ritmo añadiendo su primer escalón.',
            select_measure_title: 'Ningún Compás Seleccionado',
            select_measure_desc: 'Seleccione un compás para comenzar a editar.',
            duration: 'Duración',
            direction: 'Dirección',
            down: 'ABAJO',
            up: 'ARRIBA',
            pause: 'PAUSA',
            mute: 'SILENCIO',
            accent: 'Acento',
            strong_beat: 'Golpe Fuerte',
            strum_finger: 'Dedo de Rasgueo',
            config: {
                title: 'Configuración Global',
                tempo: 'Tempo',
                sync: 'Sincronizar Animación',
                time_sig: 'Compás'
            }
        },
        sidebar: {
            project: 'Proyecto',
            editor: 'Editor',
            settings: 'Configuraciones',
            harmony: 'Armonía',
            rhythm: 'Ritmo',
            fretboard: 'Diapasón',
            actions: 'Acciones',
            upgrade: 'Plan Pro'
        },
        fretboard: {
            map_title: 'Mapa del Diapasón',
            add_string: '+ AÑADIR CUERDA',
            no_notes: 'No hay notas en el diapasón',
            select_string: '1. Seleccionar Cuerda',
            select_finger: '2. Seleccionar Dedo',
            select_fret: '3. Seleccionar Traste',
            fret: 'TRASTE',
            nut: 'CEJILLA',
            barre_selector: '4. Seleccionar Cejilla',
            add_barre: '+ AÑADIR CEJILLA',
            barre_to: '4. Cejilla Hasta',
            barre_instruction: 'Seleccione una nota y haga clic en el número de cuerda donde debe terminar la cejilla.',
            empty_title: 'Seleccione una Nota',
            empty_desc: 'Elija una nota o acorde en la línea de tiempo para editar en el diapasón.',
            feature_finger: 'Mapear dedos',
            feature_fret: 'Seleccionar trastes',
            feature_barre: 'Editar cejillas',
            remove: 'ELIMINAR'
        },
        music: {
            root_tone: 'Tónica & Tono',
            quality: 'Calidad',
            extensions: 'Extensiones',
            bass_note: 'Nota Bajo',
            root: 'TÓNICA',
            quality_options: {
                major: 'Mayor',
                minor: 'Menor',
                dim: 'Disminuida',
                aug: 'Aumentada',
                sus2: 'Sus2',
                sus4: 'Sus4',
                maj7: 'Séptima Mayor'
            }
        },
        projects: {
            save_dialog: {
                title: 'Guardar Proyecto',
                subtitle: 'Dale un nombre a tu proyecto',
                project_name: 'Nombre del Proyecto',
                placeholder: 'Mi Proyecto Increíble',
                save: 'Guardar',
                saving: 'Guardando...',
                cancel: 'Cancelar'
            }
        }

    }
};
