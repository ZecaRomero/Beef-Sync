export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { number, message } = req.body;

    if (!number || !message) {
      return res.status(400).json({ message: 'Número e mensagem são obrigatórios' });
    }

    // Simular envio via WhatsApp API
    // Em produção, integre com uma API real como Twilio, WhatsApp Business API, etc.
    
    console.log('Enviando relatório BI via WhatsApp:', {
      to: number,
      message: message.substring(0, 100) + '...'
    });

    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Log do envio
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'BI_REPORT',
      recipient: number,
      status: 'SENT',
      messageLength: message.length
    };

    console.log('WhatsApp BI Report Log:', logEntry);

    res.status(200).json({ 
      success: true, 
      message: 'Relatório BI enviado com sucesso',
      messageId: `bi_${Date.now()}`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro ao enviar relatório BI via WhatsApp:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
}