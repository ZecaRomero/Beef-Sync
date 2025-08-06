import { useEffect } from 'react';

export default function BIPieChart({ salesData, animationProgress, pieChartRef }) {
    useEffect(() => {
        drawPieChart();
        // eslint-disable-next-line
    }, [salesData, animationProgress]);

    const drawPieChart = () => {
        const canvas = pieChartRef.current;
        if (!canvas || salesData.length === 0) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        // Dados para o gráfico de pizza
        const fivAnimals = salesData.filter(sale => sale.tipoCobertura === 'FIV').length;
        const iaAnimals = salesData.length - fivAnimals;
        const total = salesData.length;

        if (total === 0) return;

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;

        // Cores
        const fivColor = '#10b981'; // Verde
        const iaColor = '#3b82f6';  // Azul

        // Ângulos
        const fivAngle = (fivAnimals / total) * 2 * Math.PI * animationProgress;
        const iaAngle = (iaAnimals / total) * 2 * Math.PI * animationProgress;

        // Desenhar FIV
        ctx.fillStyle = fivColor;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + fivAngle);
        ctx.closePath();
        ctx.fill();

        // Desenhar IA
        ctx.fillStyle = iaColor;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, -Math.PI / 2 + fivAngle, -Math.PI / 2 + fivAngle + iaAngle);
        ctx.closePath();
        ctx.fill();

        // Círculo interno (efeito donut)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
        ctx.fill();

        // Texto central
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(total.toString(), centerX, centerY - 5);
        ctx.font = '14px Arial';
        ctx.fillText('Animais', centerX, centerY + 15);

        // Legenda
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        // FIV
        ctx.fillStyle = fivColor;
        ctx.fillRect(20, height - 60, 15, 15);
        ctx.fillStyle = '#1f2937';
        ctx.fillText(`FIV: ${fivAnimals} (${((fivAnimals / total) * 100).toFixed(1)}%)`, 45, height - 48);
        // IA
        ctx.fillStyle = iaColor;
        ctx.fillRect(20, height - 35, 15, 15);
        ctx.fillStyle = '#1f2937';
        ctx.fillText(`IA: ${iaAnimals} (${((iaAnimals / total) * 100).toFixed(1)}%)`, 45, height - 23);
        // Título
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('📊 FIV vs IA', width / 2, 25);
    };

    return (
        <canvas
            ref={pieChartRef}
            width={400}
            height={300}
            className="w-full"
            aria-label="Gráfico de pizza FIV vs IA"
            role="img"
        />
    );
}
