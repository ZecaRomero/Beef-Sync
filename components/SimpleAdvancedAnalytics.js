import React, { useState, useEffect } from "react";

const SimpleAdvancedAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    fivVsIa: {
      fiv: { count: 15, avgPrice: 45000, totalValue: 675000 },
      ia: { count: 85, avgPrice: 28500, totalValue: 2422500 }
    },
    byFather: [
      { name: 'Touro Alpha FIV', offspring: 8, avgPrice: 48000, totalValue: 384000, technique: 'FIV' },
      { name: 'Touro Beta IA', offspring: 12, avgPrice: 32000, totalValue: 384000, technique: 'IA' },
      { name: 'Touro Gamma FIV', offspring: 5, avgPrice: 52000, totalValue: 260000, technique: 'FIV' },
      { name: 'Touro Delta IA', offspring: 18, avgPrice: 29000, totalValue: 522000, technique: 'IA' }
    ]
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculateDifference = () => {
    const { fiv, ia } = analytics.fivVsIa;
    if (fiv.avgPrice === 0 || ia.avgPrice === 0) return 0;
    return ((fiv.avgPrice - ia.avgPrice) / ia.avgPrice * 100).toFixed(1);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh' }}>
      {/* Header com contraste alto */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: '#000000', 
          marginBottom: '10px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}>
          📊 Análises Avançadas de Vendas
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#333333', 
          fontWeight: '500'
        }}>
          Médias de preços, performance por pai e tendências
        </p>
      </div>

      {/* Comparação FIV vs IA */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        {/* Card FIV */}
        <div style={{ 
          backgroundColor: '#f8f4ff', 
          border: '3px solid #8b5cf6', 
          borderRadius: '12px', 
          padding: '20px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            color: '#5b21b6', 
            marginBottom: '15px',
            borderBottom: '2px solid #8b5cf6',
            paddingBottom: '8px'
          }}>
            🧬 FIV (Fertilização in Vitro)
          </h3>
          <div style={{ color: '#000000' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: '600' }}>Animais Vendidos:</span>
              <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{analytics.fivVsIa.fiv.count}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: '600' }}>Preço Médio:</span>
              <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#7c3aed' }}>
                {formatCurrency(analytics.fivVsIa.fiv.avgPrice)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '600' }}>Valor Total:</span>
              <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                {formatCurrency(analytics.fivVsIa.fiv.totalValue)}
              </span>
            </div>
          </div>
        </div>

        {/* Card IA */}
        <div style={{ 
          backgroundColor: '#f0f9ff', 
          border: '3px solid #3b82f6', 
          borderRadius: '12px', 
          padding: '20px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            color: '#1d4ed8', 
            marginBottom: '15px',
            borderBottom: '2px solid #3b82f6',
            paddingBottom: '8px'
          }}>
            💉 IA (Inseminação Artificial)
          </h3>
          <div style={{ color: '#000000' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: '600' }}>Animais Vendidos:</span>
              <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{analytics.fivVsIa.ia.count}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: '600' }}>Preço Médio:</span>
              <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#2563eb' }}>
                {formatCurrency(analytics.fivVsIa.ia.avgPrice)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '600' }}>Valor Total:</span>
              <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                {formatCurrency(analytics.fivVsIa.ia.totalValue)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo da Comparação */}
      <div style={{ 
        backgroundColor: '#f0fdf4', 
        border: '3px solid #22c55e', 
        borderRadius: '12px', 
        padding: '20px', 
        textAlign: 'center',
        marginBottom: '30px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          color: '#15803d', 
          marginBottom: '10px' 
        }}>
          💰 Diferença de Preço Médio
        </h3>
        <div style={{ 
          fontSize: '36px', 
          fontWeight: 'bold', 
          color: '#16a34a', 
          marginBottom: '5px' 
        }}>
          +{calculateDifference()}%
        </div>
        <p style={{ 
          fontSize: '16px', 
          color: '#166534', 
          fontWeight: '600' 
        }}>
          FIV tem preço médio {calculateDifference()}% maior que IA
        </p>
      </div>

      {/* Performance por Pai */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        border: '3px solid #6b7280', 
        borderRadius: '12px', 
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          color: '#000000', 
          marginBottom: '20px',
          borderBottom: '2px solid #6b7280',
          paddingBottom: '10px'
        }}>
          👨‍🦳 Performance por Pai/Touro
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            backgroundColor: '#ffffff'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #d1d5db' }}>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  fontWeight: 'bold', 
                  color: '#000000',
                  fontSize: '14px'
                }}>
                  Touro
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'center', 
                  fontWeight: 'bold', 
                  color: '#000000',
                  fontSize: '14px'
                }}>
                  Técnica
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'center', 
                  fontWeight: 'bold', 
                  color: '#000000',
                  fontSize: '14px'
                }}>
                  Filhos
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'right', 
                  fontWeight: 'bold', 
                  color: '#000000',
                  fontSize: '14px'
                }}>
                  Preço Médio
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'right', 
                  fontWeight: 'bold', 
                  color: '#000000',
                  fontSize: '14px'
                }}>
                  Valor Total
                </th>
              </tr>
            </thead>
            <tbody>
              {analytics.byFather.map((father, index) => (
                <tr key={index} style={{ 
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                }}>
                  <td style={{ 
                    padding: '12px', 
                    fontWeight: '600', 
                    color: '#000000',
                    fontSize: '14px'
                  }}>
                    {father.name}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: father.technique === 'FIV' ? '#e9d5ff' : '#dbeafe',
                      color: father.technique === 'FIV' ? '#7c3aed' : '#2563eb'
                    }}>
                      {father.technique}
                    </span>
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'center', 
                    fontWeight: '600', 
                    color: '#000000',
                    fontSize: '14px'
                  }}>
                    {father.offspring}
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'right', 
                    fontWeight: '600', 
                    color: '#16a34a',
                    fontSize: '14px'
                  }}>
                    {formatCurrency(father.avgPrice)}
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'right', 
                    fontWeight: 'bold', 
                    color: '#000000',
                    fontSize: '14px'
                  }}>
                    {formatCurrency(father.totalValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumo Final */}
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#fef3c7', 
        border: '3px solid #f59e0b', 
        borderRadius: '12px',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          color: '#92400e', 
          marginBottom: '10px' 
        }}>
          📈 Resumo Geral
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          gap: '20px', 
          color: '#000000' 
        }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {analytics.fivVsIa.fiv.count + analytics.fivVsIa.ia.count}
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600' }}>Total Vendidos</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {formatCurrency(analytics.fivVsIa.fiv.totalValue + analytics.fivVsIa.ia.totalValue)}
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600' }}>Receita Total</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {formatCurrency((analytics.fivVsIa.fiv.totalValue + analytics.fivVsIa.ia.totalValue) / (analytics.fivVsIa.fiv.count + analytics.fivVsIa.ia.count))}
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600' }}>Preço Médio Geral</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleAdvancedAnalytics;