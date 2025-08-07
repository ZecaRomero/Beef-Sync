const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🐄 Adicionando animais ativos...');

    // Buscar usuário
    const user = await prisma.user.findFirst({
        where: { email: 'Zeca@beef-sync.com' }
    });

    if (!user) {
        console.log('❌ Usuário não encontrado');
        return;
    }

    // Criar animais ativos
    const activeAnimals = [
        {
            brinco: 'BENT 20004',
            serie: 'BENT',
            nome: 'Touro BENT Elite Ativo',
            raca: 'Nelore',
            sexo: 'MACHO',
            dataNasc: new Date('2021-05-15'),
            peso: 580.0,
            categoria: 'REPRODUTOR',
            status: 'ATIVO',
            valorVenda: null,
            tipoVenda: null,
            pai: 'Touro BENT Elite Plus',
            mae: 'Vaca BENT Elite',
            tipoCobertura: 'FIV',
            observacoes: 'Touro ativo para reprodução',
            userId: user.id
        },
        {
            brinco: 'CJCG 25003',
            serie: 'CJCG',
            nome: 'Novilha CJCG Premium Ativa',
            raca: 'Angus',
            sexo: 'FEMEA',
            dataNasc: new Date('2022-08-20'),
            peso: 420.0,
            categoria: 'REPRODUTORA',
            status: 'ATIVO',
            valorVenda: null,
            tipoVenda: null,
            pai: 'Touro Angus CJCG Elite',
            mae: 'Vaca Angus CJCG Premium',
            tipoCobertura: 'FIV',
            observacoes: 'Novilha ativa para reprodução',
            userId: user.id
        },
        {
            brinco: 'CJCJ 15004',
            serie: 'CJCJ',
            nome: 'Bezerro CJCJ Ativo',
            raca: 'Brahman',
            sexo: 'MACHO',
            dataNasc: new Date('2024-03-10'),
            peso: 280.0,
            categoria: 'BEZERRO',
            status: 'ATIVO',
            valorVenda: null,
            tipoVenda: null,
            pai: 'Touro Brahman CJCJ Elite',
            mae: 'Vaca Brahman CJCJ Premium',
            tipoCobertura: 'FIV',
            observacoes: 'Bezerro ativo em crescimento',
            userId: user.id
        },
        {
            brinco: 'BENT 20005',
            serie: 'BENT',
            nome: 'Vaca BENT Elite Ativa',
            raca: 'Nelore',
            sexo: 'FEMEA',
            dataNasc: new Date('2020-12-05'),
            peso: 520.0,
            categoria: 'REPRODUTORA',
            status: 'ATIVO',
            valorVenda: null,
            tipoVenda: null,
            pai: 'Touro BENT Elite Plus',
            mae: 'Vaca BENT Elite',
            tipoCobertura: 'FIV',
            observacoes: 'Vaca ativa para reprodução',
            userId: user.id
        },
        {
            brinco: 'CJCG 25004',
            serie: 'CJCG',
            nome: 'Garrote CJCG Ativo',
            raca: 'Angus',
            sexo: 'MACHO',
            dataNasc: new Date('2023-01-15'),
            peso: 380.0,
            categoria: 'GARROTE',
            status: 'ATIVO',
            valorVenda: null,
            tipoVenda: null,
            pai: 'Touro Angus CJCG Elite',
            mae: 'Vaca Angus CJCG Premium',
            tipoCobertura: 'FIV',
            observacoes: 'Garrote ativo em engorda',
            userId: user.id
        }
    ];

    for (const animalData of activeAnimals) {
        try {
            const animal = await prisma.animal.create({
                data: animalData
            });
            console.log(`✅ Animal ativo criado: ${animal.brinco}`);
        } catch (error) {
            if (error.code === 'P2002') {
                console.log(`⚠️ Animal já existe: ${animalData.brinco}`);
            } else {
                console.error(`❌ Erro ao criar animal ${animalData.brinco}:`, error.message);
            }
        }
    }

    console.log('🎉 Animais ativos adicionados com sucesso!');
}

main()
    .catch((e) => {
        console.error('❌ Erro:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
