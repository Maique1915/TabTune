export type Language = 'pt' | 'en' | 'es';

export const translations = {
    pt: {
        menu: {
            studio_mode: 'Modo Estúdio',
            project: 'Projeto',
            harmony: 'Harmonia',
            editor: 'Editor',
            upgrade_plan: 'Plano Premium',
            confirm_exit: 'Você tem alterações não salvas. Deseja sair sem salvar?'
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
            logout: 'Sair',
            my_account: 'Minha Conta',
            levels: {
                admin: 'Membro Admin',
                plus: 'Membro Plus',
                free: 'Membro Grátis'
            }
        },
        editor: {
            fretboard: 'Braço',
            duration: 'Duração',
            duration_names: {
                title: 'Selecione a Duração',
                desc: 'Defina o tempo rítmico da nota selecionada.',
                select: 'Selecione uma duração rítmica',
                range: 'Gama de Semibreve a Fusa',
                sync: 'Sincronia automática com o motor',
                w: 'Semibreve',
                h: 'Mínima',
                q: 'Semínima',
                '8': 'Colcheia',
                '16': 'Semicolcheia',
                '32': 'Fusa'
            },
            duration_modifiers: {
                title: 'Modificadores',
                dotted: 'Pontuada',
                rest: 'Pausa',
            },
            tools: {
                title: 'Ferramentas de Edição',
                desc: 'Ações avançadas para manipular o compasso ou notas selecionadas.',
                note_tools: 'Ferramentas de Nota',
                measure_tools: 'Ferramentas de Compasso',
                selective: 'Seletivo',
                semitone: 'Semitom',
                global: 'Global',
                measure: 'Compasso',
                transpose: 'Transpor',
                auto: 'Auto',
                finger: 'Dedo',
                select: 'Edição Seletiva',
                sync: 'Sincronizar Tudo'
            },
            actions: 'Ações',
        },
        harmony: {
            title: 'Harmonia',
            root_tone: 'Tônica & Tom',
            quality: 'Qualidade',
            extensions: 'Extensões',
            bass_note: 'Nota Baixo',
            root: 'Raíz',
            show_name: 'Mostrar Nome',
            qualities: {
                major: 'Maior',
                minor: 'Menor',
                dim: 'Diminuta',
                aug: 'Aumentada',
                sus2: 'Sus2',
                sus4: 'Sus4',
                maj: 'Sétima Maior'
            },
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
                title_end: 'Criadores de Conteúdo',
                subtitle: 'Animações de braço de nível profissional para aulas, redes sociais e cursos. Crie cifras cinemáticas em segundos para qualquer instrumento de cordas.',
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
                    desc: 'Diagramas de acordes verticais focados em acordes individuais. Ideal para demonstrar formações de acordes de forma clara e objetiva.'
                },
                full_view: {
                    title: 'Visão Completa',
                    desc: 'Visualização horizontal completa do braço para posições de dedos e riffs. Perfeito para escalas e sequências complexas.'
                },
                beats: {
                    title: 'Padrões de Batida',
                    desc: 'Editor dedicado de ritmo e padrões de batida. Crie e visualize padrões rítmicos complexos independentemente.'
                }
            },
            cta: {
                title: 'Pronto para transformar suas aulas?',
                desc: 'Junte-se a milhares de criadores fazendo visuais de classe mundial com TabTune. Nenhuma habilidade de design necessária.',
                button_primary: 'Começar Grátis',
                button_secondary: 'Ver Planos'
            },
            footer: {
                terms: 'Termos de Serviço',
                privacy: 'Política de Privacidade',
                discord: 'Comunidade Discord',
                rights: '© 2024 Cifrai Animator. Todos os direitos reservados.'
            },
            about: {
                title: 'Sobre o TabTune',
                description: 'TabTune é uma plataforma profissional desenvolvida para criadores de conteúdo educacional sobre instrumentos de cordas. Crie visualizações animadas de braço de instrumento, diagramas de acordes (tela Short), posições de dedos e riffs (tela Full), além de padrões de batidas e ritmos (tela Beats). Exporte suas criações em vídeo (MP4, WebM) ou como sequência de imagens PNG em ZIP. Torne seus vídeos mais didáticos, explicativos e profissionais.'
            },
        },
        settings: {
            tabs: {
                basic: 'Básico',
                advanced: 'Avançado',
                motion: 'Movimento',
                presets: 'Estilos'
            },
            headers: {
                visual_presets: 'Predefinições Visuais',
                components: 'Componentes',
                view_transform: 'Transformação de Vista',
                animation_type: 'Tipo de Animação'
            },
            presets_desc: 'Predefinições de estilo prontas para usar.',
            professional_styles: 'Estilo Profissional',
            custom_styles: 'Estilos Personalizados',
            personal_style: 'Seu Estilo',
            save_custom_style: 'Salvar Estilo Atual',
            presets: {
                label: 'Estilos Profissionais',
                customize: 'Personalize o estilo de saída',
                default: 'Padrão Escuro',
                classic: 'Clássico Claro',
                cyberpunk: 'Cyberpunk',
                midnight: 'Azul Meia-Noite',
                vintage: 'Vintage',
                studio: 'Modo Estúdio'
            },
            groups: {
                global: 'Global & Vista',
                neck: 'Braço & Mão',
                inlays: 'Marcadores',
                strings_frets: 'Cordas & Trastes',
                fingers: 'Dedos',
                labels: 'Rótulos & Capo',
                arrows: 'Setas Rítmicas'
            },
            messages: {
                style_updated: 'Estilo atualizado!',
                style_saved: 'Estilo salvo com sucesso!',
                finger_limit: 'Limite de 5 dedos atingido!'
            },
            labels: {
                background: 'Fundo',
                global_scale: 'Escala Global',
                scale: 'Escala',
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
                rotation: 'Rotação',
                shadow_color: 'Cor da Sombra',
                global_backgroundColor: 'Cor de Fundo',
                strings_shadow: 'Sombra das Cordas',
                strings_shadow_enabled: 'Sombra das Cordas',
                strings_shadow_color: 'Cor da Sombra',
                frets_shadow: 'Sombra dos Trastes',
                frets_shadow_enabled: 'Sombra dos Trastes',
                frets_shadow_color: 'Cor da Sombra',
                fingers_shadow: 'Sombra dos Dedos',
                fingers_shadow_enabled: 'Sombra dos Dedos',
                fingers_shadow_color: 'Cor da Sombra',
                inlays_shadow: 'Sombra dos Marcadores',
                inlays_shadow_enabled: 'Sombra dos Marcadores',
                inlays_shadow_color: 'Cor da Sombra',
                capo_shadow: 'Sombra do Capo',
                capo_shadow_enabled: 'Sombra do Capo',
                capo_shadow_color: 'Cor da Sombra',
                head_shadow_enabled: 'Sombra da Mão',
                head_shadow_color: 'Cor da Sombra',
                head_border_color: 'Borda da Mão',
                neck_shadow_enabled: 'Sombra do Braço',
                neck_shadow_color: 'Cor da Sombra',
                fingers_opacity: 'Opacidade BG',
                capo_text_color: 'Cor do Texto',
                chordName_color: 'Cor do Acorde',
                arrows_color: 'Cor das Setas',
                arrows_textColor: 'Cor do Texto',
                arrows_shadow_enabled: 'Sombra das Setas',
                arrows_shadow_color: 'Cor da Sombra',
                arrows_border_enabled: 'Borda das Setas',
                arrows_border_color: 'Cor da Borda'
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
            none: 'Nenhum',
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
        },
        auth: {
            welcome_back: 'Bem-vindo de volta, Artista',
            email: 'E-mail',
            password: 'Senha',
            forgot_password: 'Esqueceu a senha?',
            login_button: 'Entrar',
            logging_in: 'Entrando...',
            or_continue_with: 'Ou continue com',
            no_account: 'Não tem uma conta?',
            signup_link: 'Cadastre-se',
            create_account: 'Criar Conta',
            name: 'Nome',
            confirm_password: 'Confirmar Senha',
            already_have_account: 'Já tem uma conta?',
            login_link: 'Entrar',
            signing_up: 'Cadastrando...',
            signup_button: 'Cadastrar'
        },
        profile: {
            title: 'Meu Perfil',
            edit_profile: 'Editar Perfil',
            sign_out: 'Sair',
            lang: 'Idioma',
            joined: 'Entrou em',
            projects: 'Meus Projetos',
            styles: 'Meus Estilos',
            chord_library: 'Biblioteca de Acordes',
            contact_admin: 'Contatar Admin',
            view_all: 'Ver Todos',
            add_shape: 'Adicionar Forma',
            empty_projects: 'Nenhum projeto encontrado nesta visão',
            create_project: 'Criar Novo Projeto',
            empty_styles: 'Nenhum estilo personalizado salvo',
            create_style: 'CRIAR NOVO ESTILO',
            member: 'MEMBRO',
            recently: 'Recentemente',
            saved_cloud: 'Salvo na Nuvem',
            open_project: 'Abrir Projeto',
            delete_project: 'Excluir Projeto',
            updated: 'Atualizado em',
            confirm: {
                delete_project: 'Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.',
                delete_style: 'Tem certeza que deseja excluir este estilo?'
            },
            messages: {
                project_deleted: 'Projeto excluído com sucesso!',
                project_delete_error: 'Falha ao excluir o projeto',
                style_deleted: 'Estilo removido com sucesso!',
                profile_updated: 'Perfil atualizado com sucesso!',
                profile_update_error: 'Erro ao atualizar perfil',
                connection_error: 'Erro de conexão ao atualizar perfil'
            },
            edit: {
                full_name: 'Nome Completo',
                email_address: 'Endereço de E-mail',
                preferred_language: 'Idioma Preferido',
                save_changes: 'Salvar Alterações',
                saving: 'Salvando...'
            }
        },
        shortcuts: {
            title: 'Atalhos do Teclado',
            description: 'Melhore sua produtividade com estes atalhos rápidos.',
            groups: {
                navigation: 'Navegação',
                editing: 'Edição',
                advanced: 'Avançado'
            },
            keys: {
                arrows: '⭠ ⭡ ⭢ ⭣',
                arrows_desc: '⭠ ⭡ ⭢ ⭣ entre Trastes e Cordas',
                alt_arrows: 'A / D',
                alt_arrows_desc: 'Navegação Hierárquica (Dedo > Acorde > Compasso)',
                shift_arrows: 'Shift + ⭡/⭣',
                shift_arrows_desc: 'Controle de Pestana',
                shift_arrows_rl: 'Shift + ⭠/⭢',
                shift_arrows_rl_desc: 'Transpor Projeto',
                ctrl_arrows_ud: 'Ctrl + ⭡/⭣',
                ctrl_arrows_ud_desc: 'Rotacionar/Espelhar Braço',
                ctrl_arrows_rl: 'Ctrl + ⭠/⭢',
                ctrl_arrows_rl_desc: 'Controle de Capo',
                ctrl_shift_arrows: 'Ctrl + Shift + ⭠/⭢',
                ctrl_shift_arrows_desc: 'Ciclar Dedos (1, 2, 3, 4, T, X)',
                toggle_barre_desc: 'Alternar Pestana',
                plus: '+',
                plus_desc: 'Adicionar Compasso',
                ctrl_space: 'Ctrl + Espaço',
                ctrl_space_desc: 'Ativar/Desativar Acento (Batida Forte)',
                ctrl_arrows_rl_beats: 'Ctrl + ⭠/⭢',
                ctrl_arrows_rl_beats_desc: 'Mudar tipos de setas',
                ctrl_shift_arrows_beats: 'Ctrl + Shift + ⭠/⭢',
                ctrl_shift_arrows_beats_desc: 'Ciclar Dedo da Batida',
                shift_plus: 'Shift + +',
                shift_plus_desc: 'Adicionar Seta/Nota',
                ctrl_plus: 'Ctrl + +',
                ctrl_plus_desc: 'Adicionar Dedo',
                minus: '-',
                minus_desc: 'Remover Compasso',
                shift_minus: 'Shift + -',
                shift_minus_desc: 'Remover Seta/Nota',
                ctrl_minus: 'Ctrl + -',
                ctrl_minus_desc: 'Remover Dedo',
                ctrl_d: 'Ctrl + D',
                ctrl_d_desc: 'Duplicar Compasso',
                alt_shift_arrows_ud_beats: 'Alt + Shift + ⭡/⭣',
                alt_shift_arrows_ud_beats_desc: 'Ciclar Duração da Batida',
                alt_arrows_ud_beats: 'W / S',
                alt_arrows_ud_beats_desc: 'Ciclar Duração da Batida'
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
            confirm_exit: 'You have unsaved changes. Do you want to leave without saving?'
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
            logout: 'Log Out',
            my_account: 'My Account',
            levels: {
                admin: 'Admin Member',
                plus: 'Plus Member',
                free: 'Free Member'
            }
        },
        editor: {
            fretboard: 'Fretboard',
            duration: 'Duration',
            duration_names: {
                title: 'Select Duration',
                desc: 'Set the rhythmic value for the selected note.',
                select: 'Select a rhythmic duration',
                range: 'Whole note to 32nd note',
                sync: 'Automatic sync with engine',
                w: 'Whole',
                h: 'Half',
                q: 'Quarter',
                '8': '8th',
                '16': '16th',
                '32': '32nd'
            },
            duration_modifiers: {
                title: 'Modifiers',
                dotted: 'Dotted',
                rest: 'Rest',
            },
            tools: {
                title: 'Editing Tools',
                desc: 'Advanced actions to manipulate the measure or selected notes.',
                note_tools: 'Note Tools',
                measure_tools: 'Measure Tools',
                selective: 'Selective',
                semitone: 'Semitone',
                global: 'Global',
                measure: 'Measure',
                transpose: 'Transpose',
                auto: 'Auto',
                finger: 'Finger',
                select: 'Selective Editing',
                sync: 'Sync All'
            },
            actions: 'Actions',
        },
        harmony: {
            title: 'Harmony',
            root_tone: 'Root & Tone',
            quality: 'Quality',
            extensions: 'Extensions',
            bass_note: 'Bass Note',
            root: 'Root',
            show_name: 'Show Name',
            qualities: {
                major: 'Major',
                minor: 'Minor',
                dim: 'Diminished',
                aug: 'Augmented',
                sus2: 'Sus2',
                sus4: 'Sus4',
                maj: 'Major 7th'
            },
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
                title_end: 'Content Creators',
                subtitle: 'Professional-grade fretboard animations for lessons, social media, and courses. Build cinematic chord charts in seconds for any stringed instrument.',
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
                    desc: 'Vertical chord diagrams focused on individual chords. Ideal for demonstrating chord formations clearly and objectively.'
                },
                full_view: {
                    title: 'Full View',
                    desc: 'Complete horizontal fretboard visualization for finger positions and riffs. Perfect for scales and complex sequences.'
                },
                beats: {
                    title: 'Strumming Patterns',
                    desc: 'Dedicated rhythm and strumming pattern editor. Create and visualize complex rhythmic patterns independently.'
                }
            },
            cta: {
                title: 'Ready to transform your lessons?',
                desc: 'Join thousands of creators making world-class visuals with TabTune. No design skills required.',
                button_primary: 'Get Started For Free',
                button_secondary: 'View Pricing Plans'
            },
            footer: {
                terms: 'Terms of Service',
                privacy: 'Privacy Policy',
                discord: 'Discord Community',
                rights: '© 2024 Cifrai Animator. All rights reserved.'
            },
            about: {
                title: 'About TabTune',
                description: 'TabTune is a professional platform designed for content creators teaching stringed instruments. Create animated fretboard visualizations, chord diagrams (Short view), finger positions and riffs (Full view), plus strumming patterns and rhythms (Beats view). Export your creations as video (MP4, WebM) or PNG image sequences in ZIP. Make your videos more educational, explanatory, and professional.'
            },
        },
        settings: {
            tabs: {
                basic: 'Basic',
                advanced: 'Advanced',
                motion: 'Motion',
                presets: 'Presets'
            },
            headers: {
                visual_presets: 'Visual Presets',
                components: 'Components',
                view_transform: 'View Transform',
                animation_type: 'Animation Type'
            },
            presets_desc: 'Professional style presets ready for output.',
            professional_styles: 'Professional Style',
            custom_styles: 'Custom Styles',
            personal_style: 'Your Style',
            save_custom_style: 'Save Current Style',
            presets: {
                label: 'Professional Styles',
                customize: 'Customize render output style',
                default: 'Default Dark',
                classic: 'Classic Light',
                cyberpunk: 'Cyberpunk',
                midnight: 'Midnight Blue',
                vintage: 'Vintage',
                studio: 'Studio Mode'
            },
            groups: {
                global: 'Global & View',
                neck: 'Neck & Headstock',
                inlays: 'Inlays (Markers)',
                strings_frets: 'Strings & Frets',
                fingers: 'Fingers',
                labels: 'Labels & Capo',
                arrows: 'Rhythm Arrows'
            },
            messages: {
                style_updated: 'Style updated!',
                style_saved: 'Style saved successfully!',
                finger_limit: '5 finger limit reached!'
            },
            labels: {
                background: 'Background',
                global_scale: 'Global Scale',
                scale: 'Scale',
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
                rotation: 'Rotation',
                shadow_color: 'Shadow Color',
                global_backgroundColor: 'Background Color',
                strings_shadow: 'Strings Shadow',
                strings_shadow_enabled: 'Strings Shadow',
                strings_shadow_color: 'Shadow Color',
                frets_shadow: 'Frets Shadow',
                frets_shadow_enabled: 'Frets Shadow',
                frets_shadow_color: 'Shadow Color',
                fingers_shadow: 'Finger Shadows',
                fingers_shadow_enabled: 'Finger Shadows',
                fingers_shadow_color: 'Shadow Color',
                inlays_shadow: 'Inlay Shadows',
                inlays_shadow_enabled: 'Inlay Shadows',
                inlays_shadow_color: 'Shadow Color',
                capo_shadow: 'Capo Shadow',
                capo_shadow_enabled: 'Capo Shadow',
                capo_shadow_color: 'Shadow Color',
                head_shadow_enabled: 'Head Shadow',
                head_shadow_color: 'Shadow Color',
                head_border_color: 'Head Border',
                neck_shadow_enabled: 'Neck Shadow',
                neck_shadow_color: 'Shadow Color',
                fingers_opacity: 'BG Opacity',
                capo_text_color: 'Text Color',
                chordName_color: 'Chord Color',
                arrows_color: 'Arrows Color',
                arrows_textColor: 'Text Color',
                arrows_shadow_enabled: 'Arrows Shadow',
                arrows_shadow_color: 'Shadow Color',
                arrows_border_enabled: 'Arrows Border',
                arrows_border_color: 'Border Color'
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
            none: 'None',
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
        },
        auth: {
            welcome_back: 'Welcome Back, Artist',
            email: 'Email',
            password: 'Password',
            forgot_password: 'Forgot Password?',
            login_button: 'Log In',
            logging_in: 'Logging In...',
            or_continue_with: 'Or continue with',
            no_account: "Don't have an account?",
            signup_link: 'Sign Up',
            create_account: 'Create Account',
            name: 'Name',
            confirm_password: 'Confirm Password',
            already_have_account: 'Already have an account?',
            login_link: 'Log In',
            signing_up: 'Signing Up...',
            signup_button: 'Sign Up'
        },
        profile: {
            title: 'My Profile',
            edit_profile: 'Edit Profile',
            sign_out: 'Sign Out',
            lang: 'Lang',
            joined: 'Joined',
            projects: 'My Projects',
            styles: 'My Styles',
            chord_library: 'Chord Library',
            contact_admin: 'Contact Admin',
            view_all: 'View All',
            add_shape: 'Add Shape',
            empty_projects: 'No projects found in this view',
            create_project: 'Create New Project',
            empty_styles: 'No custom styles saved',
            create_style: 'CREATE NEW STYLE',
            member: 'MEMBER',
            recently: 'Recently',
            saved_cloud: 'Saved in Cloud',
            open_project: 'Open Project',
            delete_project: 'Delete Project',
            updated: 'Updated',
            confirm: {
                delete_project: 'Are you sure you want to delete this project? This action cannot be undone.',
                delete_style: 'Are you sure you want to delete this style?'
            },
            messages: {
                project_deleted: 'Project deleted successfully!',
                project_delete_error: 'Failed to delete project',
                style_deleted: 'Style removed successfully!',
                profile_updated: 'Profile updated successfully!',
                profile_update_error: 'Error updating profile',
                connection_error: 'Connection error when updating profile'
            },
            edit: {
                full_name: 'Full Name',
                email_address: 'Email Address',
                preferred_language: 'Preferred Language',
                save_changes: 'Save Changes',
                saving: 'Saving...'
            }
        },
        shortcuts: {
            title: 'Keyboard Shortcuts',
            description: 'Boost your productivity with these quick shortcuts.',
            groups: {
                navigation: 'Navigation',
                editing: 'Editing',
                advanced: 'Advanced'
            },
            keys: {
                arrows: '⭠ ⭡ ⭢ ⭣',
                arrows_desc: '⭠ ⭡ ⭢ ⭣ Frets and Strings',
                alt_arrows: 'A / D',
                alt_arrows_desc: 'Hierarchical Navigation (Finger > Chord > Measure)',
                shift_arrows: 'Shift + ⭡/⭣',
                shift_arrows_desc: 'Barre Control',
                shift_arrows_rl: 'Shift + ⭠/⭢',
                shift_arrows_rl_desc: 'Transpose Project',
                ctrl_arrows_ud: 'Ctrl + ⭡/⭣',
                ctrl_arrows_ud_desc: 'Rotate/Mirror Fretboard',
                ctrl_arrows_rl: 'Ctrl + ⭠/⭢',
                ctrl_arrows_rl_desc: 'Capo Control',
                ctrl_shift_arrows: 'W / S',
                ctrl_shift_arrows_desc: 'Cycle Fingers (1, 2, 3, 4, T, X)',
                toggle_barre_desc: 'Toggle Barre (Pestana)',
                plus: '+',
                plus_desc: 'Add Measure',
                ctrl_space: 'Ctrl + Space',
                ctrl_space_desc: 'Toggle Accent (Strong Beat)',
                ctrl_arrows_rl_beats: 'Ctrl + ⭠/⭢',
                ctrl_arrows_rl_beats_desc: 'Change arrow types',
                ctrl_shift_arrows_beats: 'Ctrl + Shift + ⭠/⭢',
                ctrl_shift_arrows_beats_desc: 'Cycle Strum Finger',
                shift_plus: 'Shift + +',
                shift_plus_desc: 'Add Arrow/Note',
                ctrl_plus: 'Ctrl + +',
                ctrl_plus_desc: 'Add Finger',
                minus: '-',
                minus_desc: 'Remove Measure',
                shift_minus: 'Shift + -',
                shift_minus_desc: 'Remove Arrow/Note',
                ctrl_minus: 'Ctrl + -',
                ctrl_minus_desc: 'Remove Finger',
                ctrl_d: 'Ctrl + D',
                ctrl_d_desc: 'Duplicate Measure',
                alt_shift_arrows_ud_beats: 'Alt + Shift + ⭡/⭣',
                alt_shift_arrows_ud_beats_desc: 'Cycle Beat Duration',
                alt_arrows_ud_beats: 'W / S',
                alt_arrows_ud_beats_desc: 'Cycle Beat Duration'
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
            confirm_exit: '¿Tienes cambios sin guardar. ¿Quieres salir sin guardar?'
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
            logout: 'Cerrar Sesión',
            my_account: 'Mi Cuenta',
            levels: {
                admin: 'Miembro Admin',
                plus: 'Miembro Plus',
                free: 'Miembro Gratis'
            }
        },
        editor: {
            fretboard: 'Diapasón',
            duration: 'Duración',
            duration_names: {
                title: 'Seleccionar Duración',
                desc: 'Define el tiempo rítmico de la nota seleccionada.',
                select: 'Seleccione una duración rítmica',
                range: 'Desde redonda hasta fusa',
                sync: 'Sincronización automática con el motor',
                w: 'Redonda',
                h: 'Blanca',
                q: 'Negra',
                '8': 'Corchea',
                '16': 'Semicorchea',
                '32': 'Fusa'
            },
            duration_modifiers: {
                title: 'Modificadores',
                dotted: 'Puntillo',
                rest: 'Silencio',
            },
            tools: {
                title: 'Herramientas de Edición',
                desc: 'Acciones avanzadas para manipular el compás o las notas seleccionadas.',
                note_tools: 'Herramientas de Nota',
                measure_tools: 'Herramientas de Compás',
                selective: 'Selectivo',
                semitone: 'Semitono',
                global: 'Global',
                measure: 'Compás',
                transpose: 'Transponer',
                auto: 'Auto',
                finger: 'Dedo',
                select: 'Edición Selectiva',
                sync: 'Sincronizar Todo'
            },
            actions: 'Acciones',
        },

        harmony: {
            title: 'Armonía',
            root_tone: 'Tónica y Tono',
            quality: 'Calidad',
            extensions: 'Extensiones',
            bass_note: 'Nota de Bajo',
            root: 'Raíz',
            show_name: 'Mostrar Nombre',
            qualities: {
                major: 'Mayor',
                minor: 'Menor',
                dim: 'Diminuta',
                aug: 'Aumentada',
                sus2: 'Sus2',
                sus4: 'Sus4',
                maj: 'Séptima Mayor'
            },
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
                title_end: 'Creadores de Contenido',
                subtitle: 'Animaciones de diapasón de nivel profesional para lecciones, redes sociales y cursos. Crea gráficos de acordes cinematográficos en segundos para cualquier instrumento de cuerda.',
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
                    desc: 'Diagramas de acordes verticales enfocados en acordes individuales. Ideal para demostrar formaciones de acordes de forma clara y objetiva.'
                },
                full_view: {
                    title: 'Vista Completa',
                    desc: 'Visualización horizontal completa del diapasón para posiciones de dedos y riffs. Perfecto para escalas y secuencias complejas.'
                },
                beats: {
                    title: 'Patrones de Rasgueo',
                    desc: 'Editor dedicado de ritmo y patrones de rasgueo. Crea y visualiza patrones rítmicos complejos de forma independiente.'
                }
            },
            cta: {
                title: '¿Listo para transformar tus lecciones?',
                desc: 'Únete a miles de creadores haciendo visuales de clase mundial con TabTune. No se requieren habilidades de diseño.',
                button_primary: 'Empezar Gratis',
                button_secondary: 'Ver Planes'
            },
            footer: {
                terms: 'Términos de Servicio',
                privacy: 'Política de Privacidad',
                discord: 'Comunidad de Discord',
                rights: '© 2024 Cifrai Animator. Todos los derechos reservados.'
            },
            about: {
                title: 'Acerca de TabTune',
                description: 'TabTune es una plataforma profesional diseñada para creadores de contenido educativo sobre instrumentos de cuerda. Crea visualizaciones animadas de diapasón, diagramas de acordes (vista Short), posiciones de dedos y riffs (vista Full), además de patrones de rasgueo y ritmos (vista Beats). Exporta tus creaciones en video (MP4, WebM) o como secuencia de imágenes PNG en ZIP. Haz que tus videos sean más didácticos, explicativos y profesionales.'
            },
        },
        settings: {
            tabs: {
                basic: 'Básico',
                advanced: 'Avanzado',
                motion: 'Movimiento',
                presets: 'Estilos'
            },
            headers: {
                visual_presets: 'Preajustes Visuales',
                components: 'Componentes',
                view_transform: 'Transformación de Vista',
                animation_type: 'Tipo de Animación'
            },
            presets_desc: 'Preajustes de estilo listos para usar.',
            professional_styles: 'Estilo Profesional',
            custom_styles: 'Estilos Personalizados',
            personal_style: 'Tu Estilo',
            save_custom_style: 'Guardar Estilo Actual',
            presets: {
                label: 'Estilos Profesionales',
                customize: 'Personalizar estilo de salida',
                default: 'Predeterminado Oscuro',
                classic: 'Clásico Claro',
                cyberpunk: 'Cyberpunk',
                midnight: 'Azul Medianoche',
                vintage: 'Vintage',
                studio: 'Modo Estudio'
            },
            groups: {
                global: 'Global & Vista',
                neck: 'Mástil & Pala',
                inlays: 'Marcadores',
                strings_frets: 'Cuerdas & Trastes',
                fingers: 'Dedos',
                labels: 'Etiquetas & Cejilla',
                arrows: 'Flechas Rítmicas'
            },
            messages: {
                style_updated: '¡Estilo actualizado!',
                style_saved: '¡Estilo guardado con éxito!',
                finger_limit: '¡Límite de 5 dedos alcanzado!'
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
                rotation: 'Rotación',
                shadow_color: 'Color de Sombra',
                global_backgroundColor: 'Color de Fondo',
                strings_shadow: 'Sombra de Cuerdas',
                strings_shadow_enabled: 'Sombra de Cuerdas',
                strings_shadow_color: 'Color de Sombra',
                frets_shadow: 'Sombra de Trastes',
                frets_shadow_enabled: 'Sombra de Trastes',
                frets_shadow_color: 'Color de Sombra',
                fingers_shadow: 'Sombra de Dedos',
                fingers_shadow_enabled: 'Sombra de Dedos',
                fingers_shadow_color: 'Color de Sombra',
                inlays_shadow: 'Sombra de Marcadores',
                inlays_shadow_enabled: 'Sombra de Marcadores',
                inlays_shadow_color: 'Color de Sombra',
                capo_shadow: 'Sombra de Cejilla',
                capo_shadow_enabled: 'Sombra de Cejilla',
                capo_shadow_color: 'Color de Sombra',
                head_shadow_enabled: 'Sombra de la Pala',
                head_shadow_color: 'Color de Sombra',
                head_border_color: 'Borde de la Pala',
                neck_shadow_enabled: 'Sombra del Mástil',
                neck_shadow_color: 'Color de Sombra',
                fingers_opacity: 'Opacidad BG',
                capo_text_color: 'Color de Texto',
                chordName_color: 'Color del Acorde',
                arrows_color: 'Color de Flechas',
                arrows_textColor: 'Color de Texto',
                arrows_shadow_enabled: 'Sombra de Flechas',
                arrows_shadow_color: 'Color de Sombra',
                arrows_border_enabled: 'Borde de Flechas',
                arrows_border_color: 'Color del Borde'
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
        },
        auth: {
            welcome_back: 'Bienvenido de nuevo, Artista',
            email: 'Correo electrónico',
            password: 'Contraseña',
            forgot_password: '¿Olvidaste tu contraseña?',
            login_button: 'Iniciar Sesión',
            logging_in: 'Iniciando sesión...',
            or_continue_with: 'O continuar con',
            no_account: '¿No tienes una cuenta?',
            signup_link: 'Regístrate',
            create_account: 'Crear Cuenta',
            name: 'Nombre',
            confirm_password: 'Confirmar Contraseña',
            already_have_account: '¿Ya tienes una cuenta?',
            login_link: 'Iniciar Sesión',
            signing_up: 'Registrando...',
            signup_button: 'Registrarse'
        },
        profile: {
            title: 'Mi Perfil',
            edit_profile: 'Editar Perfil',
            sign_out: 'Cerrar Sesión',
            lang: 'Idioma',
            joined: 'Se unió',
            projects: 'Mis Proyectos',
            styles: 'Mis Estilos',
            chord_library: 'Biblioteca de Acordes',
            contact_admin: 'Contactar Admin',
            view_all: 'Ver Todo',
            add_shape: 'Añadir Forma',
            empty_projects: 'No se encontraron proyectos en esta vista',
            create_project: 'Crear Nuevo Proyecto',
            empty_styles: 'No hay estilos personalizados guardados',
            create_style: 'CREAR NUEVO ESTILO',
            member: 'MIEMBRO',
            recently: 'Recientemente',
            saved_cloud: 'Guardado en la Nube',
            open_project: 'Abrir Proyecto',
            delete_project: 'Eliminar Proyecto',
            updated: 'Actualizado',
            confirm: {
                delete_project: '¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.',
                delete_style: '¿Estás seguro de que quieres eliminar este estilo?'
            },
            messages: {
                project_deleted: '¡Proyecto eliminado con éxito!',
                project_delete_error: 'Error al eliminar el proyecto',
                style_deleted: '¡Estilo eliminado con éxito!',
                profile_updated: '¡Perfil actualizado con éxito!',
                profile_update_error: 'Error al actualizar el perfil',
                connection_error: 'Error de conexión al actualizar el perfil'
            },
            edit: {
                full_name: 'Nombre Completo',
                email_address: 'Correo Electrónico',
                preferred_language: 'Idioma Preferido',
                save_changes: 'Guardar Cambios',
                saving: 'Guardando...'
            }
        },
        shortcuts: {
            title: 'Atajos de Teclado',
            description: 'Mejora tu productividad con estos atajos rápidos.',
            groups: {
                navigation: 'Navegação',
                editing: 'Edición',
                advanced: 'Avanzado'
            },
            keys: {
                arrows: '⭠ ⭡ ⭢ ⭣',
                arrows_desc: '⭠ ⭡ ⭢ ⭣ entre Trastes y Cuerdas',
                alt_arrows: 'A / D',
                alt_arrows_desc: 'Navegación Jerárquica (Dedo > Acorde > Compás)',
                shift_arrows: 'Shift + ⭡/⭣',
                shift_arrows_desc: 'Control de Cejilla',
                shift_arrows_rl: 'Shift + ⭠/⭢',
                shift_arrows_rl_desc: 'Transponer Proyecto',
                ctrl_arrows_ud: 'Ctrl + ⭡/⭣',
                ctrl_arrows_ud_desc: 'Rotar/Espejar Diapasón',
                ctrl_arrows_rl: 'Ctrl + ⭠/⭢',
                ctrl_arrows_rl_desc: 'Control de Cejilla (Capo)',
                ctrl_shift_arrows: 'W / S',
                ctrl_shift_arrows_desc: 'Ciclar Dedos (1, 2, 3, 4, T, X)',
                toggle_barre_desc: 'Alternar Cejuela',
                plus: '+',
                plus_desc: 'Añadir Compás',
                ctrl_space: 'Ctrl + Espacio',
                ctrl_space_desc: 'Activar/Desactivar Acento (Golpe Fuerte)',
                ctrl_arrows_rl_beats: 'Ctrl + ⭠/⭢',
                ctrl_arrows_rl_beats_desc: 'Cambiar tipos de flechas',
                ctrl_shift_arrows_beats: 'Ctrl + Shift + ⭠/⭢',
                ctrl_shift_arrows_beats_desc: 'Ciclar Dedo del Golpe',
                shift_plus: 'Shift + +',
                shift_plus_desc: 'Añadir Flecha/Nota',
                ctrl_plus: 'Ctrl + +',
                ctrl_plus_desc: 'Añadir Dedo',
                minus: '-',
                minus_desc: 'Eliminar Compás',
                shift_minus: 'Shift + -',
                shift_minus_desc: 'Eliminar Flecha/Nota',
                ctrl_minus: 'Ctrl + -',
                ctrl_minus_desc: 'Eliminar Dedo',
                ctrl_d: 'Ctrl + D',
                ctrl_d_desc: 'Duplicar Compás',
                alt_shift_arrows_ud_beats: 'Alt + Shift + ⭡/⭣',
                alt_shift_arrows_ud_beats_desc: 'Ciclar Duración de Beat',
                alt_arrows_ud_beats: 'W / S',
                alt_arrows_ud_beats_desc: 'Ciclar Duración del Golpe'
            }
        }
    }
};
