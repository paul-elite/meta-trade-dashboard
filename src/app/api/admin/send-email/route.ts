import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()

        // Verify admin is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check if user is admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single()

        if (!profile?.is_admin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { to, subject, body, userName } = await request.json()

        if (!to || !subject || !body) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Create email transporter
        // Note: In production, use environment variables for credentials
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'infobitcapmining@gmail.com',
                pass: process.env.EMAIL_PASS, // App-specific password from Gmail
            },
        })

        // Compose email
        const mailOptions = {
            from: {
                name: 'Bitcap Mining',
                address: process.env.EMAIL_USER || 'infobitcapmining@gmail.com',
            },
            to,
            subject,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #18181b; border-radius: 16px; overflow: hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 32px; text-align: center; background: linear-gradient(135deg, #18181b 0%, #27272a 100%);">
                      <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #EAB308;">Bitcap Mining</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 32px;">
                      <p style="margin: 0 0 16px 0; font-size: 16px; color: #a1a1aa;">Hello ${userName || 'there'},</p>
                      <div style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #e4e4e7; white-space: pre-wrap;">${body}</div>
                      <p style="margin: 24px 0 0 0; font-size: 14px; color: #71717a;">Best regards,<br>The Bitcap Mining Team</p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 32px; background-color: #0a0a0a; border-top: 1px solid #27272a;">
                      <p style="margin: 0; font-size: 12px; color: #52525b; text-align: center;">
                        This email was sent from Bitcap Mining. If you have any questions, 
                        please contact us at support@bitcapmining.com
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
            text: `Hello ${userName || 'there'},\n\n${body}\n\nBest regards,\nThe Bitcap Mining Team`,
        }

        // Send email
        await transporter.sendMail(mailOptions)

        return NextResponse.json({ success: true, message: 'Email sent successfully' })
    } catch (error) {
        console.error('Error sending email:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to send email' },
            { status: 500 }
        )
    }
}
